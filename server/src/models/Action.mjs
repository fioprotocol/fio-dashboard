import Sequelize from 'sequelize';
import crypto from 'crypto';

import { Notification, User } from './';
import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class Action extends Base {
  static get TYPE() {
    return {
      CONFIRM_EMAIL: 'confirmEmail',
      RESET_PASSWORD: 'resetPassword',
      RESEND_EMAIL_CONFIRM: 'resendEmailConfirm',
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

    await new Notification({
      type: Notification.TYPE.INFO,
      title: 'Account Confirmation',
      message: 'Your email is confirmed',
      userId: user.id,
      data: {
        pagesToShow: [
          '/',
          '/cart',
          '/checkout',
          '/fio-addresses-selection',
          '/fio-domains-selection',
        ],
      },
    }).save();

    return user.update({ status: User.STATUS.ACTIVE });
  }

  static generateHash() {
    return crypto.randomBytes(20).toString('hex');
  }
}
