import crypto from 'crypto';

import Sequelize from 'sequelize';

import config from '../config/index';

import Base from './Base';

import { User } from './User';
import { Wallet } from './Wallet';

const { DataTypes: DT } = Sequelize;

export class Nonce extends Base {
  static get EXPIRATION_TIME() {
    return 30 * 60 * 1000; // 30 min
  }
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        value: { type: DT.STRING, allowNull: false },
        email: { type: DT.STRING, allowNull: false },
      },
      {
        sequelize,
        tableName: 'nonces',
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }

  static getItem(where) {
    return this.findOne({
      where: { ...where },
      include: [User],
    });
  }

  static isExpired(createdAt) {
    return new Date().getTime() - new Date(createdAt).getTime() > this.EXPIRATION_TIME;
  }

  static generateHash(string) {
    return crypto
      .createHmac('sha256', config.secret)
      .update(string)
      .digest('hex');
  }

  static async verify({ userId, challenge, signatures }) {
    const nonce = await this.findOne({
      where: {
        userId,
        value: challenge,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!nonce || this.isExpired(nonce.createdAt)) {
      nonce && this.isExpired(nonce.createdAt) && (await nonce.destroy());

      return false;
    }

    let verified = false;
    const wallets = await Wallet.findAll({
      where: { userId },
      raw: true,
      attributes: ['publicKey'],
    });
    for (const wallet of wallets) {
      for (const signature of signatures) {
        verified = User.verify({
          challenge: nonce.value,
          publicKey: wallet.publicKey,
          signature,
        });
        if (verified) break;
      }

      if (verified) break;
    }

    if (verified) await nonce.destroy();

    return verified;
  }

  static format({ id, value, userId, User, createdAt }) {
    return {
      id,
      value,
      userId,
      email: User.email,
      createdAt,
    };
  }
}
