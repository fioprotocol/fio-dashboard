import Sequelize from 'sequelize';

import Base from '../Base';
import X from '../Exception';
import { generate } from './authToken';

import {
  User,
  UserDevice,
  Nonce,
  Notification,
  ReferrerProfile,
  Wallet,
  Cart,
} from '../../models';

import { DAY_MS } from '../../config/constants.js';
import logger from '../../logger.mjs';
import emailSender from '../emailSender.mjs';
import marketingSendinblue from '../../external/marketing-sendinblue.mjs';
import { templates } from '../../emails/emailTemplate';
import { AUTH_TYPE } from '../../tools.mjs';

const EXPIRATION_TIME = DAY_MS; // 1 day

export default class AuthCreate extends Base {
  static get validationRules() {
    return {
      email: ['required', 'trim', 'email', 'to_lc'],
      signatures: [{ list_of: 'string' }],
      challenge: ['string'],
      referrerCode: ['string'],
      timeZone: ['string'],
      edgeWallets: [
        {
          list_of_objects: [
            {
              edgeId: ['string'],
              name: ['string'],
              publicKey: ['string'],
              from: ['string'],
            },
          ],
        },
      ],
      username: ['required', 'string'],
    };
  }

  async execute({
    challenge,
    email,
    edgeWallets,
    referrerCode,
    signatures,
    timeZone,
    username,
  }) {
    const userByEmail = await User.findOneWhere({
      email,
      status: { [Sequelize.Op.ne]: User.STATUS.BLOCKED },
    });

    const userByUsername = await User.findOneWhere({
      username,
      status: { [Sequelize.Op.ne]: User.STATUS.BLOCKED },
    });

    let user;

    if (userByEmail && userByUsername && userByEmail.id === userByUsername.id) {
      user = userByEmail;
    } else if (!userByEmail && !userByUsername) {
      try {
        const refProfile = await ReferrerProfile.findOneWhere({
          code: referrerCode || '',
        });

        const refProfileId = refProfile ? refProfile.id : null;

        const user = new User({
          username,
          email,
          status: User.STATUS.ACTIVE,
          refProfileId,
          isOptIn: true,
          freeId: username,
        });

        await user.save();

        await marketingSendinblue.addEmailToPromoList(email);

        await emailSender.send(templates.createAccount, email);

        await new Notification({
          type: Notification.TYPE.INFO,
          contentType: Notification.CONTENT_TYPE.ACCOUNT_CREATE,
          userId: user.id,
          data: { pagesToShow: ['/myfio'] },
        }).save();

        for (const { edgeId, name, publicKey } of edgeWallets) {
          const newWallet = new Wallet({
            edgeId,
            name,
            publicKey,
            userId: user.id,
          });

          await newWallet.save();
        }

        await UserDevice.add(user.id, this.context.device);

        const now = new Date();
        const responseData = {
          jwt: generate(
            { type: AUTH_TYPE.USER, id: user.id },
            new Date(EXPIRATION_TIME + now.getTime()),
          ),
          isSignUp: true,
        };

        if (timeZone) {
          await user.update({ timeZone });
        }

        return {
          data: responseData,
        };
      } catch (error) {
        logger.error(email, username, error);
        throw new X({
          code: 'SERVER_ERROR',
          fields: {
            registration: 'REGISTRATION_FAILED',
          },
        });
      }
    }

    if (!user) {
      logger.error(email, username, 'Auth failed');
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }

    const wallets = await Wallet.list({ userId: user.id });
    let verified = false;

    if (!wallets.length && edgeWallets) {
      for (const edgeWallet of edgeWallets) {
        const newWallet = new Wallet({ ...edgeWallet, userId: user.id });
        await newWallet.save();

        for (const signature of signatures) {
          verified = User.verify({
            challenge,
            publicKey: edgeWallet.publicKey,
            signature,
          });
          if (verified) break;
        }

        if (verified) break;
      }
    } else {
      for (const wallet of wallets) {
        for (const signature of signatures) {
          verified = User.verify({ challenge, publicKey: wallet.publicKey, signature });
          if (verified) break;
        }

        if (verified) break;
      }
    }

    if (!verified) {
      logger.error(email, username, 'Verification failed');
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }

    const nonce = await Nonce.findOne({
      where: {
        email,
        value: challenge,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!nonce || nonce.value !== challenge || Nonce.isExpired(nonce.createdAt)) {
      nonce && Nonce.isExpired(nonce.createdAt) && (await nonce.destroy());
      logger.error(email, username, 'Challenge failed');
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }
    await nonce.destroy();

    const now = new Date();
    const responseData = {
      jwt: generate(
        { type: AUTH_TYPE.USER, id: user.id },
        new Date(EXPIRATION_TIME + now.getTime()),
      ),
    };

    if (timeZone) {
      await user.update({ timeZone });
    }

    if (this.context.guestId) {
      await Cart.updateGuestCartUser(user.id, this.context.guestId);
    }

    // Fire and forget - no need to await
    UserDevice.check(user, this.context.device);

    return {
      data: responseData,
    };
  }

  static get paramsSecret() {
    return ['data.email', 'data.pin', 'data.signature', 'data.challenge'];
  }

  static get resultSecret() {
    return ['data.jwt'];
  }
}
