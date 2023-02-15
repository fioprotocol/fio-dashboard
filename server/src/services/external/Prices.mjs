import { fioApi } from '../../external/fio';
import { getROE } from '../../external/roe';
import logger from '../../logger';
import Base from '../Base';
import { FioRegApi } from '../../external/fio-reg';

export default class Prices extends Base {
  static get validationRules() {
    return {
      forceRefresh: ['boolean'],
    };
  }

  async execute({ forceRefresh }) {
    const pricing = {
      nativeFio: {
        domain: null,
        address: null,
        renewDomain: null,
        addBundles: null,
      },
      usdtRoe: null,
    };
    try {
      const roePromise = getROE();
      const pricesPromise = fioApi.getPrices(forceRefresh);

      pricing.usdtRoe = await roePromise;
      pricing.nativeFio = await pricesPromise;
    } catch (e) {
      logger.error(`Get prices from reg site error: ${e}`);
    }
    return {
      data: { pricing },
    };
  }

  // todo: check if we could use reg api for this
  async executeRegApi() {
    try {
      const res = await FioRegApi.prices();

      return { data: res };
    } catch (e) {
      logger.error(`Get prices from reg site error: ${e}`);
    }
    return {
      data: {},
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
