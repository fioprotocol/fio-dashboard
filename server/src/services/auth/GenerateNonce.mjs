import crypto from 'crypto';

import { Nonce } from '../../models';
import Base from '../Base';

export default class AuthGenerateNonce extends Base {
  async execute() {
    const nonce = Nonce.generateHash(crypto.randomBytes(8).toString('hex'));

    return {
      data: { nonce },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
