import superagent from 'superagent';

import { Var } from '../models/Var.mjs';

import MathOp from '../services/math.mjs';

import logger from '../logger';

const ROE_VAR_KEY = 'ROE';
const roeEndpoint = process.env.FIO_ROE_URL || 'https://ascendex.com/api/pro/v1/';
const timeout = 1000 * 60 * 15; // 15 min

/**
 * Get the ROE from the AscendEx API
 *
 * @returns {Promise<string | null>} The ROE
 */
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
        let sum = '0';
        for (const tradeItem of data) {
          sum = new MathOp(sum).add(tradeItem.p).toString();
        }
        const avgPrice = new MathOp(sum).div(data.length).toString();

        await Var.setValue(ROE_VAR_KEY, avgPrice);

        return avgPrice;
      }
    } catch (e) {
      logger.error('ROE UPDATE ERROR ===');
      logger.error(e);
      return (roeVar && new MathOp(roeVar.value).toString()) || null;
    }
  }

  return new MathOp(roeVar.value).toString();
};
