import fetch from 'node-fetch';

import logger from '../logger.mjs';

const FIO_HISTORY_URL = `${process.env.FIO_HISTORY_NODE_URL}history`;

export default class FioHistory {
  async requestHistory(params) {
    try {
      const result = await fetch(`${FIO_HISTORY_URL}/get_actions`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      return result.json();
    } catch (err) {
      logger.error('Get FIO History Error', err);
    }
  }
  async getTransaction(transactionId) {
    try {
      const result = await fetch(`${FIO_HISTORY_URL}/get_transaction`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: transactionId,
          block_num_hint: 0,
        }),
      });

      return result.json();
    } catch (err) {
      logger.error(`Get FIO History For Transaction: ${transactionId}`, err);
    }
  }
}
