import crypto from 'crypto';

import Sequelize from 'sequelize';

import config from '../config/index';

import Base from './Base';

import { User } from './User';

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
