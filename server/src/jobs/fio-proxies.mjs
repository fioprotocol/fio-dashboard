import '../db';

import CommonJob from './job.mjs';
import logger from '../logger.mjs';
import { Var } from '../models/index.mjs';
import { VARS_KEYS } from '../config/constants.js';
import { HTTP_CODES } from '../constants/general.mjs';
import { fetchFioProxyStatuses } from '../utils/fio.mjs';

class FioProxiesJob extends CommonJob {
  async execute() {
    try {
      const proxies = await fetchFioProxyStatuses();

      await Var.setValue(VARS_KEYS.FIO_PROXIES_LIST, JSON.stringify(proxies));

      const activeCount = proxies.filter(
        item => Number(item.status) === HTTP_CODES.SUCCESS,
      ).length;
      this.postMessage(
        `FIO proxies job updated ${proxies.length} entries (${activeCount} active).`,
      );
    } catch (error) {
      logger.error('FIO proxies job failed');
      logger.error(error);
    } finally {
      this.finish();
    }
  }
}

new FioProxiesJob().execute();
