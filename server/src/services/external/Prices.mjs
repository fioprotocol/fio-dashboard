import { fioApi } from '../../external/fio';
import { getROE } from '../../external/roe';
import logger from '../../logger';
import Base from '../Base';

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

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
