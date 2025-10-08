import Sequelize from 'sequelize';
import { sortByDistance } from 'sort-by-distance';

import Base from './Base';
import { Var } from './Var.mjs';
import { getLocByCountry } from '../external/geo/index.mjs';
import { VARS_KEYS } from '../config/constants.js';

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

  static async getApiUrls({ type, location = '', tz = '', supportsCors = false }) {
    const where = {};
    if (type) where.type = type;
    if (supportsCors) where.data = { supports_cors: true };

    const urls = await this.findAll({
      order: [['rank', 'DESC']],
      where,
    });

    const dynamicFetch = Number(await Var.getValByKey(VARS_KEYS.API_URLS_DYNAMIC_FETCH));
    const blockedApiUrlsList = await Var.getValByKey(VARS_KEYS.API_URLS_BLOCKED);
    const blockedApiUrlsListArray = JSON.parse(blockedApiUrlsList);

    const filteredUrls =
      blockedApiUrlsListArray && blockedApiUrlsListArray.length
        ? urls.filter(
            item =>
              !blockedApiUrlsListArray.some(blockedUrl =>
                item.url.startsWith(blockedUrl),
              ),
          )
        : urls;
    if (!dynamicFetch) return filteredUrls.map(item => item.url);

    const defaultLocData = getLocByCountry();
    const locData = getLocByCountry({ code: location, tz });
    const sorted = sortByDistance(
      { x: locData.latitude, y: locData.longitude },
      filteredUrls.map(({ url, data }) =>
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
