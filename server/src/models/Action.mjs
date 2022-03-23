import crypto from 'crypto';

import Sequelize from 'sequelize';

import { User } from './User.mjs';
import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class Action extends Base {
  static get TYPE() {
    return {
      CONFIRM_EMAIL: 'confirmEmail',
      RESET_PASSWORD: 'resetPassword',
      RESEND_EMAIL_CONFIRM: 'resendEmailConfirm',
      UPDATE_EMAIL: 'updateEmail',
    };
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        hash: { type: DT.STRING, allowNull: false, unique: true },
        type: { type: DT.STRING },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'actions',
      },
    );
  }

  run(data) {
    return this[this.type](data);
  }

  async confirmEmail() {
    const user = await User.findById(this.data.userId);

    return user.update({ status: User.STATUS.ACTIVE });
  }

  async updateEmail() {
    const user = await User.findById(this.data.userId);

    return user.update({ status: User.STATUS.ACTIVE, email: this.data.newEmail });
  }

  static generateHash() {
    return crypto.randomBytes(20).toString('hex');
  }
}
