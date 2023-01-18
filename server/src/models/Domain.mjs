import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT, Op } = Sequelize;

export class Domain extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        name: { type: DT.STRING, allowNull: true, comment: 'Domain name' },
        rank: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        isPremium: {
          type: DT.BOOLEAN,
          defaultValue: false,
        },
        isDashboardDomain: {
          type: DT.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'domains',
        paranoid: true,
      },
    );
  }

  static getDashboardDomains() {
    return this.findAll({
      where: {
        isDashboardDomain: {
          [Op.eq]: true,
        },
      },
      order: [['rank', 'DESC']],
    });
  }

  static getAvailableDomains() {
    return this.findAll({
      where: {
        isDashboardDomain: {
          [Op.eq]: false,
        },
      },
      order: [['rank', 'DESC']],
    });
  }
}
