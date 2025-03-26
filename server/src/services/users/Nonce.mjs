import crypto from 'crypto';

import Sequelize from 'sequelize';

import { ActionLimit, Nonce, Var } from '../../models';
import Base from '../Base';
import X from '../Exception';

import { VARS_KEYS } from '../../config/constants';

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

    let nonce = null;
    const createUserNonce = async () => {
      const nonceValue = Nonce.generateHash(crypto.randomBytes(8).toString('hex'));

      nonce = new Nonce({
        userId: this.context.id,
        email: '',
        value: nonceValue,
      });

      await nonce.save();

      return nonce;
    };

    const USER_NONCE_LIMIT = await Var.getValByKey(VARS_KEYS.USER_NONCE_LIMIT);

    const actionCompleted = await ActionLimit.executeWithinLimit(
      this.context.id,
      ActionLimit.ACTION.USER_NONCE,
      createUserNonce,
      { maxCount: USER_NONCE_LIMIT },
    );

    if (!actionCompleted) {
      throw new X({
        code: 'LIMIT_EXCEEDED',
        fields: {
          email: 'TOO_MANY_NONCE_REQUESTS',
        },
      });
    }

    if (!nonce) {
      throw new X({
        code: 'SERVER_ERROR',
        fields: {},
      });
    }

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
