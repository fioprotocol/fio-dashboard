import Sequelize from 'sequelize';

import Base from '../Base';
import X from '../Exception';
import { generate } from './authToken';

import { User, Nonce, Wallet } from '../../models';

import { DAY_MS } from '../../config/constants.js';

const EXPIRATION_TIME = DAY_MS; // 1 day

export default class AuthCreate extends Base {
  static get validationRules() {
    return {
      email: ['required', 'trim', 'email', 'to_lc'],
      signatures: [{ list_of: 'string' }],
      challenge: ['string'],
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
    };
  }

  async execute({ email, edgeWallets, signatures, challenge, timeZone }) {
    const user = await User.findOneWhere({
      email,
      status: { [Sequelize.Op.ne]: User.STATUS.BLOCKED },
    });

    if (!user) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
        },
      });
    }

    const wallets = await Wallet.list({ userId: user.id });
    let verified = false;

    if (!wallets.length && edgeWallets) {
      for (const edgeWallet of edgeWallets) {
        const newWallet = new Wallet({ ...edgeWallet, userId: user.id });
        await newWallet.save();

        for (const signature of signatures) {
          verified = User.verify(challenge, edgeWallet.publicKey, signature);
          if (verified) break;
        }
      }
    } else {
      for (const wallet of wallets) {
        for (const signature of signatures) {
          verified = User.verify(challenge, wallet.publicKey, signature);
          if (verified) break;
        }
      }
    }

    if (!verified) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
          signature: 'INVALID',
        },
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
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          challenge: 'INVALID',
        },
      });
    }
    await nonce.destroy();

    const now = new Date();
    const responseData = {
      jwt: generate({ id: user.id }, new Date(EXPIRATION_TIME + now.getTime())),
    };

    if (timeZone) {
      await user.update({ timeZone });
    }

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
