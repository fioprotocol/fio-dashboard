import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class AdminUsersStatus extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.INTEGER, primaryKey: true, autoIncrement: true },
        status: { type: DT.STRING, unique: true, allowNull: false },
      },
      {
        sequelize,
        tableName: 'admin-users-statuses',
        timestamps: true,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'status'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static list() {
    return this.findAll();
  }
}
