import fetch from 'node-fetch';

import logger from '../logger.mjs';

export default class FioHistory {
  constructor({ fioHistoryUrls }) {
    this.historyNodeUrls = fioHistoryUrls;
  }

  setHistoryNodeUrls(historyUrls) {
    this.historyNodeUrls = historyUrls;
  }

  async requestHistory(params) {
    for (const url of this.historyNodeUrls) {
      try {
        const result = await fetch(`${url}history/get_actions`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        return result.json();
      } catch (err) {
        logger.error(`Get FIO History Error for URL: ${url}`, err);
      }
    }

    throw new Error('All FIO History URLs failed');
  }

  async getTransaction(transactionId) {
    for (const url of this.historyNodeUrls) {
      try {
        const result = await fetch(`${url}history/get_transaction`, {
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
        logger.error(
          `Get FIO History For Transaction: ${transactionId} Error for URL: ${url}`,
          err,
        );
      }
    }

    throw new Error('All FIO History URLs failed');
  }
}
