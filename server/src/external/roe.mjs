import superagent from 'superagent';
import logger from '../logger';

const roeEndpoint = 'https://ascendex.com/api/pro/v1/';
const minToUpdate = 15;
const roe = {
  value: null,
  updatedAt: new Date(),
};

export const getROE = async () => {
  const now = new Date();

  const diffMins = Math.round((((now - roe.updatedAt) % 86400000) % 3600000) / 60000);
  if (diffMins > minToUpdate || !roe.value) {
    try {
      const {
        body: {
          data: { data },
        },
      } = await superagent.get(`${roeEndpoint}trades?symbol=FIO/USDT`);
      if (data.length) {
        let sum = 0;
        for (const tradeItem of data) {
          sum += parseFloat(tradeItem.p);
        }
        const avgPrice = sum / data.length;
        roe.value = avgPrice;
        roe.updatedAt = now;
        return avgPrice;
      }
    } catch (e) {
      logger.error('ROE UPDATE ERROR ===');
      logger.error(e);
      return roe.value;
    }
  }

  return roe.value;
};
