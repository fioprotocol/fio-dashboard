import superagent from 'superagent';
import Big from 'big.js';

import { Var } from '../models/Var.mjs';

import logger from '../logger';

const ROE_VAR_KEY = 'ROE';
const roeEndpoint = process.env.FIO_ROE_URL || 'https://ascendex.com/api/pro/v1/';
const timeout = 1000 * 60 * 15; // 15 min

export const getROE = async () => {
  const roeVar = await Var.getByKey(ROE_VAR_KEY);

  if (!roeVar || Var.updateRequired(roeVar.updatedAt, timeout)) {
    try {
      const {
        body: {
          data: { data },
        },
      } = await superagent.get(`${roeEndpoint}trades?symbol=FIO/USDT`);
      if (data.length) {
        let sum = 0;
        for (const tradeItem of data) {
          sum = Big(sum)
            .plus(tradeItem.p)
            .toNumber();
        }
        const avgPrice = Big(sum)
          .div(data.length)
          .toNumber();

        await Var.setValue(ROE_VAR_KEY, avgPrice);

        return avgPrice;
      }
    } catch (e) {
      logger.error('ROE UPDATE ERROR ===');
      logger.error(e);
      return (roeVar && +roeVar.value) || null;
    }
  }

  return +roeVar.value;
};
