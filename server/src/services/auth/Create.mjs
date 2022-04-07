import Sequelize from 'sequelize';

import Base from '../Base';
import X from '../Exception';
import { generate } from './authToken';

import { User, Nonce, Wallet, Action } from '../../models';

const EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 1 day

export default class AuthCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            email: ['required', 'trim', 'email', 'to_lc'],
            signature: ['string'],
            challenge: ['string'],
          },
        },
      ],
    };
  }

  async execute({ data: { email, signature, challenge } }) {
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
    for (const wallet of wallets) {
      verified = User.verify(challenge, wallet.publicKey, signature);
      if (verified) break;
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

    if (user.status === User.STATUS.NEW) {
      let resendConfirmEmailAction = await Action.findOneWhere({
        type: Action.TYPE.RESEND_EMAIL_CONFIRM,
        data: { userId: user.id, email: user.email },
      });
      if (resendConfirmEmailAction)
        await resendConfirmEmailAction.destroy({ force: true });
      resendConfirmEmailAction = await new Action({
        type: Action.TYPE.RESEND_EMAIL_CONFIRM,
        hash: Action.generateHash(),
        data: {
          userId: user.id,
          email: user.email,
        },
      }).save();

      responseData.emailConfirmationToken = resendConfirmEmailAction.hash;
    }

    return {
      data: responseData,
    };
  }

  static get paramsSecret() {
    return ['data.email', 'data.pin', 'data.signature', 'data.challenge'];
  }

  static get resultSecret() {
    return ['data.jwt', 'data.emailConfirmationToken'];
  }
}
