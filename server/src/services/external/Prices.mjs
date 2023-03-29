import { fioApi } from '../../external/fio';
import { getROE } from '../../external/roe';
import logger from '../../logger';
import Base from '../Base';
import X from '../Exception.mjs';

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

      if (!pricing.usdtRoe || Object.values(pricing.nativeFio).some(price => !price)) {
        throw new Error('Cannot get prices or roe');
      }
    } catch (e) {
      logger.error(`[Service Prices] Get Prices error: ${e}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          pricing: 'SERVER_ERROR',
        },
      });
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
