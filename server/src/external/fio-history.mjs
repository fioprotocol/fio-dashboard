import logger from '../logger.mjs';
import { fetchWithRateLimit } from '../utils/general.mjs';

export default class FioHistory {
  constructor({ fioHistoryUrls }) {
    this.historyNodeUrls = fioHistoryUrls;
  }

  setHistoryNodeUrls(historyUrls) {
    this.historyNodeUrls = historyUrls;
  }

  async requestHistoryActions({ params, maxRetries }) {
    const queryString = new URLSearchParams(params).toString();

    for (const url of this.historyNodeUrls) {
      try {
        const result = await fetchWithRateLimit({
          url: `${url}history/get_actions?${queryString}`,
          maxRetries,
        });

        const data = await result.json();

        return data;
      } catch (err) {
        logger.error(`Get FIO History Error for URL: ${url}`, err);
      }
    }

    throw new Error('All FIO History URLs failed');
  }

  async getTransaction({ transactionId, maxRetries }) {
    const queryString = new URLSearchParams({
      id: transactionId,
      block_hint: 0,
    }).toString();

    for (const url of this.historyNodeUrls) {
      try {
        const result = await fetchWithRateLimit({
          url: `${url}history/get_transaction?${queryString}`,
          maxRetries,
        });

        const data = await result.json();

        return data;
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
