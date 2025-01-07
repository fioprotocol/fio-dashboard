import fetch from 'node-fetch';

import '../db';
import { FioApiUrl, Var } from '../models/index.mjs';
import CommonJob from './job.mjs';
import MathOp from '../services/math.mjs';

import logger from '../logger.mjs';

import { VARS_KEYS } from '../config/constants.js';
import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';

const FETCH_URL = process.env.API_URLS_JOB_ENDPOINT;
const MIN_VOTES = process.env.API_URLS_JOB_MIN_VOTES;
const REQUIRED_APIS = ['/v1/chain/get_block', '/v1/chain/get_info'];

class ApiUrlsJob extends CommonJob {
  async execute() {
    const minVersion = await Var.getValByKey(VARS_KEYS.API_URLS_MIN_VERSION);
    const dynamicFetch = Number(await Var.getValByKey(VARS_KEYS.API_URLS_DYNAMIC_FETCH));

    if (!dynamicFetch) {
      this.postMessage('Dynamic fetch is off');
      return this.finish();
    }
    this.postMessage(`Process api urls - ${FETCH_URL}`);

    const processUrl = (item, index, sqlTransaction) => async () => {
      try {
        const {
          server_version,
          url,
          api,
          hyperion,
          votes,
          score: { score },
          location_country,
          location_latitude,
          location_longitude,
        } = item;

        if (!this.minVersionRequired(server_version, minVersion)) return;
        if (!this.votesRequired(votes)) return;

        let id = index * 4;
        const rank = score;
        const location = location_country;
        const data = { location_longitude, location_latitude };
        if (api) {
          if (!(await this.hasRequiredEndpoints(url))) return;
          await FioApiUrl.create(
            {
              id,
              url: `${url}/v1/`,
              type: FIO_API_URLS_TYPES.DASHBOARD_API,
              rank,
              location,
              data,
            },
            { transaction: sqlTransaction },
          );
          await FioApiUrl.create(
            {
              id: ++id,
              url: `${url}/v1/`,
              type: FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_API,
              rank,
              location,
              data,
            },
            { transaction: sqlTransaction },
          );
        }
        if (hyperion) {
          await FioApiUrl.create(
            {
              id: ++id,
              url: `${url}/v2/`,
              type: FIO_API_URLS_TYPES.DASHBOARD_HISTORY_URL,
              rank,
              location,
              data,
            },
            { transaction: sqlTransaction },
          );
          await FioApiUrl.create(
            {
              id: ++id,
              url: `${url}/v2/`,
              type: FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_HISTORY_V2_URL,
              rank,
              location,
              data,
            },
            { transaction: sqlTransaction },
          );
        }
      } catch (err) {
        logger.error(err);
      }
    };

    let list = [];
    try {
      const res = await fetch(FETCH_URL);
      list = await res.json();
    } catch (err) {
      logger.error(err);
    }

    list.sort(({ score: { score } }, { score: { score: score2 } }) => score > score2);
    list.splice(
      Math.ceil(list.length / 2) + 1,
      list.length - Math.ceil(list.length / 2) - 1,
    ); // Ceil half + 1 (9 -> 6)

    const sqlTransaction = await FioApiUrl.sequelize.transaction();
    await FioApiUrl.destroy({ truncate: true, force: true, transaction: sqlTransaction });

    const methods = list.map((item, i) => processUrl(item, i, sqlTransaction));

    this.postMessage(`Process api urls - ${methods.length}`);

    await this.executeActions(methods);
    await sqlTransaction.commit();

    this.finish();
  }

  minVersionRequired(version, minVersion) {
    const [, , maj, min, sub] = version.match(/v?((\d+)\.(\d+)\.(\d+))/);
    const [, , minMaj, minMin, minSub] = minVersion.match(/v?((\d+)\.(\d+)\.(\d+))/);

    return (
      Number(maj) > Number(minMaj) ||
      (Number(maj) === Number(minMaj) && Number(min) > Number(minMin)) ||
      (Number(maj) === Number(minMaj) &&
        Number(min) === Number(minMin) &&
        Number(sub) >= Number(minSub))
    );
  }

  votesRequired(votes) {
    return new MathOp(votes).gte(MIN_VOTES);
  }

  async hasRequiredEndpoints(url) {
    const res = await fetch(`${url}/v1/node/get_supported_apis`);
    const supportedList = await res.json();

    for (const url of REQUIRED_APIS) {
      if (supportedList.apis.indexOf(url) === -1) return false;
    }

    return true;
  }
}

new ApiUrlsJob().execute();
