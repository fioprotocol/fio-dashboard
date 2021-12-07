import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class NewDeviceTwoFactor extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        voucherId: { type: DT.STRING, allowNull: false },
        deviceDescription: { type: DT.STRING, allowNull: true },
        userId: { type: DT.UUID },
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

  static format({ id, voucherId, deviceDescription, createdAt }) {
    return {
      id,
      voucherId,
      deviceDescription,
      createdAt,
    };
  }
}
