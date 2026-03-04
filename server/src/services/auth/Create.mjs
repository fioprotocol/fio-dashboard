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
  Var,
  Wallet,
  Cart,
} from '../../models';

import { DAY_MS, VARS_KEYS } from '../../config/constants.js';
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
              publicKey: ['string', 'fio_public_key'],
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
    return await User.sequelize.transaction(async t => {
      const userByEmail = await User.findOneWhere(
        { email, status: { [Sequelize.Op.ne]: User.STATUS.BLOCKED } },
        { transaction: t },
      );

      const userByUsername = await User.findOneWhere(
        { username, status: { [Sequelize.Op.ne]: User.STATUS.BLOCKED } },
        { transaction: t },
      );

      let user;
      const device = this.context && this.context.device ? this.context.device : null;
      let deviceToken = device && device.token ? device.token : null;

      if (userByEmail && userByUsername && userByEmail.id === userByUsername.id) {
        user = userByEmail;
      } else if (!userByEmail && !userByUsername) {
        try {
          const refProfile = await ReferrerProfile.findOneWhere(
            { code: referrerCode || '' },
            { transaction: t },
          );

          const refProfileId = refProfile ? refProfile.id : null;

          const user = new User({
            username,
            email,
            status: User.STATUS.ACTIVE,
            refProfileId,
            isOptIn: true,
            freeId: username,
          });

          await user.save({ transaction: t });

          await new Notification({
            type: Notification.TYPE.INFO,
            contentType: Notification.CONTENT_TYPE.ACCOUNT_CREATE,
            userId: user.id,
            data: { pagesToShow: ['/myfio'] },
          }).save({ transaction: t });

          const maxWallets = Number(await Var.getValByKey(VARS_KEYS.SET_WALLETS_AMOUNT));
          const walletsToSave = maxWallets
            ? edgeWallets.slice(0, maxWallets)
            : edgeWallets;

          for (const { edgeId, name, publicKey } of walletsToSave) {
            const newWallet = new Wallet({
              edgeId,
              name,
              publicKey,
              userId: user.id,
            });

            await newWallet.save({ transaction: t });
          }

          const { token } = await UserDevice.add(user.id, this.context.device, {
            transaction: t,
          });

          if (!deviceToken) {
            deviceToken = token;
          }

          if (timeZone) {
            await user.update({ timeZone }, { transaction: t });
          }

          const now = new Date();
          const responseData = {
            jwt: generate(
              { type: AUTH_TYPE.USER, id: user.id },
              new Date(EXPIRATION_TIME + now.getTime()),
            ),
            isSignUp: true,
            deviceToken,
          };

          // External marketing/email calls after DB writes succeed within the transaction.
          // Non-critical: failures here are logged but don't roll back user creation.
          try {
            await marketingSendinblue.addEmailToPromoList(email);
            await emailSender.send(templates.createAccount, email);
          } catch (emailErr) {
            logger.error('Post-signup email/marketing error', emailErr);
          }

          return {
            data: responseData,
          };
        } catch (error) {
          if (error instanceof X) {
            throw error;
          }
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

      const wallets = await Wallet.list({ userId: user.id }, true, { transaction: t });
      let verified = false;

      if (!wallets.length && edgeWallets) {
        const maxWallets = Number(await Var.getValByKey(VARS_KEYS.SET_WALLETS_AMOUNT));
        const walletsToSave = maxWallets ? edgeWallets.slice(0, maxWallets) : edgeWallets;

        for (const edgeWallet of walletsToSave) {
          const newWallet = new Wallet({ ...edgeWallet, userId: user.id });
          await newWallet.save({ transaction: t });

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
        transaction: t,
      });

      if (!nonce || nonce.value !== challenge || Nonce.isExpired(nonce.createdAt)) {
        nonce &&
          Nonce.isExpired(nonce.createdAt) &&
          (await nonce.destroy({ transaction: t }));
        logger.error(email, username, 'Challenge failed');
        throw new X({
          code: 'AUTHENTICATION_FAILED',
          fields: {},
        });
      }
      await nonce.destroy({ transaction: t });

      const now = new Date();
      const responseData = {
        jwt: generate(
          { type: AUTH_TYPE.USER, id: user.id },
          new Date(EXPIRATION_TIME + now.getTime()),
        ),
      };

      if (timeZone) {
        await user.update({ timeZone }, { transaction: t });
      }

      if (this.context.guestId) {
        await Cart.updateGuestCartUser(user.id, this.context.guestId, { transaction: t });
      }

      const { token } = await UserDevice.check(user, this.context.device, {
        transaction: t,
      });

      if (!deviceToken) {
        deviceToken = token;
      }

      return {
        data: { ...responseData, deviceToken },
      };
    });
  }

  static get paramsSecret() {
    return ['data.email', 'data.pin', 'data.signature', 'data.challenge'];
  }

  static get resultSecret() {
    return ['data.jwt'];
  }
}
