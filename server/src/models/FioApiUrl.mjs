import Sequelize from 'sequelize';
import { sortByDistance } from 'sort-by-distance';

import Base from './Base';
import { getLocByCountry } from '../external/geo/index.mjs';

const { DataTypes: DT } = Sequelize;

export class FioApiUrl extends Base {
  static get LOCATION() {
    return {
      US: 'US',
    };
  }

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
        location: {
          type: DT.STRING,
        },
        data: {
          type: DT.JSON,
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
      default: ['id', 'url', 'rank', 'type', 'location', 'data', 'createdAt'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async getApiUrls({ type, location = this.LOCATION.US, tz = '' }) {
    const where = {};
    if (type) where.type = type;

    const urls = await this.findAll({
      order: [['rank', 'DESC']],
      where,
    });

    const defaultLocData = getLocByCountry({ code: this.LOCATION.US });
    const locData = getLocByCountry({ code: location, tz });
    const sorted = sortByDistance(
      { x: locData.latitude, y: locData.longitude },
      urls.map(({ url, data }) =>
        data && data.location_latitude
          ? { url, x: data.location_latitude, y: data.location_longitude }
          : { url, x: defaultLocData.latitude, y: defaultLocData.longitude },
      ),
      { type: 'haversine' },
    );

    return sorted.map(item => item.url);
  }

  static format({ id, rank, url, type, location, data }) {
    return {
      id,
      rank,
      url,
      type,
      location,
      data,
    };
  }
}
