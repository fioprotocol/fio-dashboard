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
        const data = await fetchWithRateLimit({
          url: `${url}history/get_actions?${queryString}`,
          maxRetries,
        });

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

    for (let i = 0; i < this.historyNodeUrls.length; i++) {
      const url = this.historyNodeUrls[i];
      const isLastUrl = i === this.historyNodeUrls.length - 1;

      try {
        const data = await fetchWithRateLimit({
          url: `${url}history/get_transaction?${queryString}`,
          maxRetries,
        });

        // If we have data and executed is true, return immediately
        if (data && data.executed !== false) {
          return data;
        }

        // If this is the last URL, return whatever we got
        if (isLastUrl) {
          return data;
        }

        // Otherwise, continue to next URL
        logger.info(
          `Transaction ${transactionId} has executed: false or no result for URL: ${url}, trying next URL`,
        );
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
