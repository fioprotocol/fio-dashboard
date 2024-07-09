import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class FioApiUrl extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        url: {
          type: DT.STRING,
          allowNull: false,
        },
        rank: {
          type: DT.BIGINT,
        },
        type: {
          type: DT.STRING,
        },
      },
      {
        sequelize,
        tableName: 'fio-api-urls',
        paranoid: true,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'url', 'rank', 'type', 'createdAt'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async getApiUrls({ type }) {
    const urls = await this.findAll({
      order: [['rank', 'ASC']],
      where: { type },
    });

    return urls.map(item => item.url);
  }

  static format({ id, rank, url, type }) {
    return {
      id,
      rank,
      url,
      type,
    };
  }
}
