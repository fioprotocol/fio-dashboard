import crypto from 'crypto';

import Sequelize from 'sequelize';

import { Nonce } from '../../models';
import Base from '../Base';

export default class UsersNonce extends Base {
  async execute() {
    // Delete expired nonces
    await Nonce.destroy({
      where: {
        userId: this.context.id,
        createdAt: {
          [Sequelize.Op.lt]: new Date(new Date().getTime() - Nonce.EXPIRATION_TIME),
        },
      },
    });

    const nonceValue = Nonce.generateHash(crypto.randomBytes(8).toString('hex'));

    const nonce = new Nonce({
      userId: this.context.id,
      email: '',
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
