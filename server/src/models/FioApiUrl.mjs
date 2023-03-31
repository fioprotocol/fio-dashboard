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
      default: ['id', 'url', 'rank', 'createdAt'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async getApiUrls() {
    const urls = await this.findAll({ order: [['rank', 'ASC']] });
    return urls.map(item => item.url);
  }

  static format({ id, rank, url }) {
    return {
      id,
      rank,
      url,
    };
  }
}
