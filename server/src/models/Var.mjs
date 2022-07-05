import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class Var extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        key: { type: DT.STRING, allowNull: false },
        value: { type: DT.TEXT, allowNull: false },
      },
      {
        sequelize,
        tableName: 'vars',
      },
    );
  }

  static format({ id, key, value, createdAt, updatedAt }) {
    return {
      id,
      key,
      value,
      createdAt,
      updatedAt,
    };
  }
}
