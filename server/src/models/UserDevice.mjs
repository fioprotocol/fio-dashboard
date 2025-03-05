import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class UserDevice extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        hash: { type: DT.STRING, allowNull: false },
        info: { type: DT.JSON, allowNull: false },
      },
      {
        sequelize,
        tableName: 'user-devices',
        indexes: [
          {
            fields: ['hash'],
            using: 'BTREE',
          },
          {
            fields: ['userId', 'hash'],
            unique: true,
            name: 'user_devices_user_hash_unique',
          },
        ],
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }

  static format({ id, hash, info, createdAt }) {
    return {
      id,
      hash,
      info,
      createdAt,
    };
  }
}
