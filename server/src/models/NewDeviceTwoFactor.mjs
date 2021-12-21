import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

const { DataTypes: DT } = Sequelize;

const EXPIRED_NEW_DEVICE_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days

export class NewDeviceTwoFactor extends Base {
  static get STATUS() {
    return {
      REQUESTED: 'REQUESTED',
      REJECTED: 'REJECTED',
    };
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        voucherId: { type: DT.STRING, allowNull: false },
        deviceDescription: { type: DT.STRING, allowNull: true },
        userId: { type: DT.UUID },
        status: {
          type: DT.STRING,
          defaultValue: this.STATUS.REQUESTED,
        },
      },
      {
        sequelize,
        tableName: 'new-device-two-factor',
        paranoid: true,
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'newDeviceTwoFactor',
    });
  }

  static getItem(where) {
    return this.findOne({
      where: { ...where },
    });
  }

  static format({ id, voucherId, deviceDescription, createdAt, status }) {
    return {
      id,
      voucherId,
      deviceDescription,
      createdAt,
      status,
    };
  }

  static async isExpired(newDeviceItem) {
    const expiredTime =
      new Date(newDeviceItem.createdAt).getTime() + EXPIRED_NEW_DEVICE_DAYS;
    if (expiredTime > new Date().getTime()) return false;

    await this.destroy({
      where: { voucherId: newDeviceItem.voucherId },
      force: true,
    });
    return true;
  }
}
