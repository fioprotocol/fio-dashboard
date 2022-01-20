import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class Contact extends Base {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DT.UUID,
          defaultValue: DT.UUIDV4,
          primaryKey: true,
        },
        name: { type: DT.STRING },
      },
      {
        sequelize,
        tableName: 'contacts-list',
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }

  static list(where, order, limit = null) {
    if (!order) order = [['name', 'ASC']];
    return this.findAll({
      where: { ...where },
      order,
      limit,
    });
  }

  static getItem(where) {
    return this.findOne({
      where: { ...where },
    });
  }

  static format({ name }) {
    return name;
  }
}
