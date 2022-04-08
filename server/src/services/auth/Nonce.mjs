import crypto from 'crypto';

import { User, Nonce } from '../../models';
import Base from '../Base';
import X from '../Exception';

export default class AuthNonce extends Base {
  static get validationRules() {
    return {
      username: ['required', 'string'],
    };
  }

  async execute({ username }) {
    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
        },
      });
    }
    const { email } = user;

    const existingNonce = await Nonce.findOne({
      where: {
        email,
      },
    });
    if (existingNonce) {
      if (!Nonce.isExpired(existingNonce.createdAt)) {
        return {
          data: { email, nonce: existingNonce.value },
        };
      }

      await existingNonce.destroy();
    }
    const nonceValue = Nonce.generateHash(crypto.randomBytes(8).toString('hex'));
    const nonce = new Nonce({
      email,
      value: nonceValue,
    });

    await nonce.save();

    return {
      data: { email, nonce: nonce.value },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
