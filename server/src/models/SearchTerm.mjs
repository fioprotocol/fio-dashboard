import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT, Op } = Sequelize;

export class SearchTerm extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        term: { type: DT.STRING, allowNull: true, comment: 'Search term' },
        rank: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        isPrefix: {
          type: DT.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'search-terms',
        paranoid: true,
      },
    );
  }

  static getPrefixes() {
    return this.findAll({
      where: {
        isPrefix: {
          [Op.eq]: true,
        },
      },
      order: [['rank', 'ASC']],
    });
  }

  static getPostfixes() {
    return this.findAll({
      where: {
        isPrefix: {
          [Op.eq]: false,
        },
      },
      order: [['rank', 'ASC']],
    });
  }
}
