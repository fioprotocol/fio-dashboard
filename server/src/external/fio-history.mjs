import fetch from 'node-fetch';

import logger from '../logger.mjs';

export default class FioHistory {
  async requestHistory(params) {
    try {
      const result = await fetch(
        `${process.env.FIO_HISTORY_NODE_URL}history/get_actions`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        },
      );

      return result.json();
    } catch (err) {
      logger.error('Get FIO History Error', err);
    }
  }
}
