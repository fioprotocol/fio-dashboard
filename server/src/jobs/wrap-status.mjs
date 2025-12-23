import { EvmChainProcessor } from '../services/wrapStatus/EvmChainProcessor.mjs';
import { FioChainProcessor } from '../services/wrapStatus/FioChainProcessor.mjs';
import { getEvmChains } from '../config/chains.mjs';
import { RateLimiter } from '../services/RateLimiter.mjs';
import { FioApiUrl } from '../models/index.mjs';
import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';
import logger from '../logger.mjs';

export class WrapStatusJobRefactored {
  constructor() {
    this.rateLimiter = new RateLimiter();
  }

  async getActionUrls() {
    return FioApiUrl.getApiUrls({
      type: FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_API,
    });
  }

  async getHistoryV2Urls() {
    return FioApiUrl.getApiUrls({
      type: FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_HISTORY_V2_URL,
    });
  }

  async execute() {
    try {
      logger.info('Starting wrap status processing...');

      // Get FIO URLs first
      const fioActionUrls = await this.getActionUrls();
      const fioHistoryV2Urls = await this.getHistoryV2Urls();

      const evmChains = getEvmChains();

      logger.info(
        `Processing ${evmChains.length} EVM chains: ${evmChains
          .map(c => c.name)
          .join(', ')}`,
      );

      // Process EVM chains sequentially to avoid rate limits
      for (const chainConfig of evmChains) {
        try {
          logger.info(`Starting ${chainConfig.name} chain processing...`);
          const processor = new EvmChainProcessor(chainConfig.name, this.rateLimiter);
          const eventsProcessed = await processor.processChain();
          logger.info(
            `Completed ${chainConfig.name}: ${eventsProcessed} events processed`,
          );
        } catch (error) {
          logger.error(`Error processing ${chainConfig.name} chain:`, error.message);
          logger.error(error);
          // Continue with next chain even if one fails
        }
      }

      // Process FIO chain
      try {
        logger.info('Starting FIO chain processing...');
        const fioProcessor = new FioChainProcessor(
          this.rateLimiter,
          fioActionUrls,
          fioHistoryV2Urls,
        );
        await fioProcessor.processChain();
        logger.info(`Completed FIO chain processing`);
      } catch (error) {
        logger.error('Error processing FIO chain:', error.message);
        logger.error(error);
      }

      logger.info('Wrap status job completed successfully');
    } catch (error) {
      logger.error('Wrap status job error:', error);
      throw error;
    }
  }
}

// If this is the main entry point
new WrapStatusJobRefactored().execute();
