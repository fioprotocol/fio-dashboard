import crypto from 'crypto';

import { User, Nonce } from '../../models';
import Base from '../Base';

export default class AuthNonce extends Base {
  static get validationRules() {
    return {
      username: ['required', 'string', 'to_lc'],
    };
  }

  async execute({ username }) {
    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      const nonceValue = Nonce.generateHash(crypto.randomBytes(8).toString('hex'));
      return { data: { nonce: nonceValue } };
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
          data: { nonce: existingNonce.value },
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
      data: { nonce: nonce.value },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
