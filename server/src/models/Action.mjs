import crypto from 'crypto';

import Sequelize from 'sequelize';

import { AdminUser } from './AdminUser.mjs';
import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class Action extends Base {
  static get TYPE() {
    return {
      RESET_PASSWORD: 'resetPassword',
      CONFIRM_ADMIN_EMAIL: 'confirmAdminEmail',
      RESET_ADMIN_PASSWORD: 'resetAdminPasswordEmail',
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

  async confirmAdminEmail() {
    const adminUser = await AdminUser.findByPk(this.data.adminId);

    return adminUser.update({ statusType: 2 });
  }

  static generateHash() {
    return crypto.randomBytes(20).toString('hex');
  }
}
