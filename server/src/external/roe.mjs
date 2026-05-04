import superagent from 'superagent';

import { Var } from '../models/Var.mjs';

import MathOp from '../services/math.mjs';

import logger from '../logger';

import config from '../config/index.mjs';

const ROE_VAR_KEY = 'ROE';
const CMC_FIO_ID = '5865';
const roeEndpoint =
  'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=fio-protocol';
const timeout = 1000 * 60 * 15; // 15 min

/**
 * Get the ROE from the CoinMarketCap API
 *
 * @returns {Promise<string | null>} The ROE
 */
export const getROE = async () => {
  const roeVar = await Var.getByKey(ROE_VAR_KEY);

  if (!roeVar || Var.updateRequired(roeVar.updatedAt, timeout)) {
    try {
      const {
        body: { data },
      } = await superagent
        .get(roeEndpoint)
        .set('X-CMC_PRO_API_KEY', config.coinmarketcap.apiKey)
        .set('cache-control', 'no-cache');

      const price =
        data[CMC_FIO_ID] && data[CMC_FIO_ID].quote && data[CMC_FIO_ID].quote.USD
          ? data[CMC_FIO_ID].quote.USD.price
          : null;

      if (price && price > 0) {
        const priceStr = new MathOp(price).toString();
        await Var.setValue(ROE_VAR_KEY, priceStr);
        return priceStr;
      }
    } catch (e) {
      logger.error('ROE UPDATE ERROR ===');
      logger.error(e);
      return (roeVar && new MathOp(roeVar.value).toString()) || null;
    }
  }

  return new MathOp(roeVar.value).toString();
};
