import crypto from 'crypto';
import { Nonce } from '../../models';
import Base from '../Base';

export default class AuthNonce extends Base {
  static get validationRules() {
    return {
      email: ['required', 'string'],
    };
  }

  async execute({ email }) {
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
