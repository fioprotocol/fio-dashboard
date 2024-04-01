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
        expirationDate: {
          type: DT.STRING,
          defaultValue: null,
        },
      },
      {
        sequelize,
        tableName: 'domains',
        paranoid: true,
      },
    );
  }

  static async getDashboardDomains() {
    const dashboardDomains = await this.findAll({
      where: {
        isDashboardDomain: {
          [Op.eq]: true,
        },
      },
      order: [['rank', 'ASC']],
    });

    return dashboardDomains.map(dashboardDomainItem => this.format(dashboardDomainItem));
  }

  static getAvailableDomains() {
    return this.findAll({
      where: {
        isDashboardDomain: {
          [Op.eq]: false,
        },
      },
      order: [
        ['rank', 'ASC'],
        ['name', 'ASC'],
      ],
    });
  }

  static format({ id, isDashboardDomain, isPremium, expirationDate, name, rank }) {
    return {
      id,
      isDashboardDomain,
      isPremium,
      expirationDate,
      name,
      rank,
    };
  }
}
