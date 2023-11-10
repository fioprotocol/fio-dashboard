import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class FreeAddress extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        name: { type: DT.STRING, allowNull: false },
      },
      {
        sequelize,
        tableName: 'free-addresses',
        paranoid: true,
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'freeAddresses',
    });
  }

  static getItems(where) {
    return this.findAll({
      where: { ...where },
    });
  }

  static format({ id, name, createdAt }) {
    return {
      id,
      name,
      createdAt,
    };
  }
}
