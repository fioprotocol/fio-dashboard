// server/services/wrapStatus/FioChainProcessor.mjs
/**
 * FIO chain event processor
 */
import superagent from 'superagent';

import { Account, Action } from '@fioprotocol/fiosdk';

import { fioApi } from '../../external/fio.mjs';
import { WrapStatusBlockNumbers } from '../../models/WrapStatusBlockNumbers.mjs';
import { WrapStatusFioChainEvents } from '../../models/WrapStatusFioChainEvents.mjs';
import { CHAINS_CONFIG } from '../../config/chains.mjs';
import { CHAIN_CODES } from '../../constants/chain.mjs';
import { FIO_API_URLS_TYPES } from '../../constants/fio.mjs';
import { compareTimestampsWithThreshold } from '../../utils/general.mjs';

import MathOp from '../math.mjs';
import { sleep } from '../../tools.mjs';
import { SECOND_MS } from '../../config/constants.js';
import logger from '../../logger.mjs';

import config from '../../config/index.mjs';

export class FioChainProcessor {
  constructor(rateLimiter, apiUrls, historyV2Urls) {
    this.config = CHAINS_CONFIG.FIO;
    this.rateLimiter = rateLimiter;
    this.apiUrls = apiUrls;
    this.historyV2Urls = historyV2Urls;
    this.chunkSize = config.wrap.fioHistoryV2.chunkSize;
  }

  async getLastProcessedBlock() {
    const lastBlock = await WrapStatusBlockNumbers.getBlockNumber({
      networkId: this.config.id,
    });
    return lastBlock || 0;
  }

  async updateLastProcessedBlock(blockNumber) {
    await WrapStatusBlockNumbers.setBlockNumber({
      value: blockNumber,
      networkId: this.config.id.toString(),
    });
  }

  async getChainInfo() {
    for (const url of this.apiUrls) {
      try {
        const res = await this.rateLimiter.executeWithRetry(
          () => superagent.get(`${url}chain/get_info`),
          `FIO chain info from ${url}`,
        );
        return res.body;
      } catch (error) {
        logger.error(`Failed to get chain info from ${url}:`, error.message);
      }
    }
    throw new Error('Failed to get chain info from all URLs');
  }

  async getBlockTransactions(blockNumber) {
    for (const url of this.apiUrls) {
      try {
        const res = await this.rateLimiter.executeWithRetry(
          () =>
            superagent
              .post(`${url}chain/get_block`)
              .send({ block_num_or_id: blockNumber }),
          `FIO block ${blockNumber} from ${url}`,
        );
        return res.body;
      } catch (error) {
        logger.error(`Failed to get block ${blockNumber} from ${url}:`, error.message);
      }
    }
    return null;
  }

  async getFioActionsV2(params) {
    const queryParams = { ...params };
    delete queryParams.fromBlockNum;
    delete queryParams.toBlockNum;

    const queryString = new URLSearchParams(queryParams).toString();

    for (const url of this.historyV2Urls) {
      try {
        const response = await this.rateLimiter.executeWithRetry(async () => {
          const res = await superagent.get(`${url}history/get_actions?${queryString}`);
          return res.body;
        }, `FIO actions V2 from ${url}`);
        return response;
      } catch (error) {
        logger.error(`Failed to fetch from ${url}:`, error.message);
      }
    }
    return null;
  }

  async getFioDeltasV2(params) {
    const queryString = new URLSearchParams(params).toString();

    for (const url of this.historyV2Urls) {
      try {
        const response = await this.rateLimiter.executeWithRetry(async () => {
          const res = await superagent.get(`${url}history/get_deltas?${queryString}`);
          return res.body;
        }, `FIO deltas V2 from ${url}`);
        return response;
      } catch (error) {
        logger.error(`Failed to fetch deltas from ${url}:`, error.message);
      }
    }
    return null;
  }

  async processActionsByName({ actionName, fromBlock, toBlock, limit }) {
    const params = {
      account: Account.oracle,
      checkLib: true,
      limit,
      'act.name': actionName,
      block_num: `${fromBlock}-${toBlock}`,
    };

    const actions = [];
    let currentToBlock = toBlock;

    while (currentToBlock >= fromBlock) {
      const actionLogs = await this.getFioActionsV2({
        ...params,
        block_num: `${fromBlock}-${currentToBlock}`,
      });

      if (!actionLogs || !actionLogs.actions || !actionLogs.actions.length) break;

      actions.push(...actionLogs.actions);

      if (
        actionLogs.total &&
        actionLogs.total.value &&
        new MathOp(actionLogs.total.value).lte(actions.length)
      ) {
        break;
      }

      const lastAction = actionLogs.actions[actionLogs.actions.length - 1];
      currentToBlock = lastAction.block_num;
    }

    return Object.values(
      actions.reduce((acc, action) => {
        acc[action.trx_id] = action;
        return acc;
      }, {}),
    );
  }

  async getOracleTableWrapItems(lowerBound, upperBound) {
    const limit = 1000;
    const oracleItems = [];

    const params = {
      json: true,
      code: Account.oracle,
      limit,
      scope: Account.oracle,
      table: 'oracleldgrs',
      reverse: true,
    };

    if (lowerBound) params.lower_bound = lowerBound;
    if (upperBound) params.upper_bound = upperBound;

    let hasMore = true;
    let currentUpperBound = upperBound;

    while (hasMore) {
      if (currentUpperBound) params.upper_bound = currentUpperBound;

      const response = await this.rateLimiter.executeWithRetry(
        () =>
          fioApi.getTableRows({
            params,
            apiUrlType: FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_API,
          }),
        'FIO oracle table rows',
      );

      if (!response || !response.rows || !response.rows.length) break;

      oracleItems.push(...response.rows);
      hasMore = response.more;

      if (hasMore) {
        const lastRow = response.rows[response.rows.length - 1];
        currentUpperBound = lastRow.id - 1;
      }
    }

    return oracleItems;
  }

  async processWrapActions({ fromBlock, toBlock }) {
    logger.info('[FIO] Processing wrap actions');

    const limit = config.wrap.fioHistoryV2Offset;
    const wrapTokenActions = await this.processActionsByName({
      actionName: Action.wrapTokens,
      fromBlock,
      toBlock,
      limit,
    });
    const wrapDomainActions = await this.processActionsByName({
      actionName: Action.wrapDomain,
      fromBlock,
      toBlock,
      limit,
    });

    const filteredWrapTokens = wrapTokenActions.filter(
      ({ act }) =>
        act &&
        act.data &&
        (act.data.chain_code === CHAIN_CODES.ETH ||
          act.data.chain_code === CHAIN_CODES.BASE),
    );
    const filteredWrapDomains = wrapDomainActions.filter(
      ({ act }) =>
        act &&
        act.data &&
        (act.data.chain_code === CHAIN_CODES.MATIC ||
          act.data.chain_code === CHAIN_CODES.POL),
    );

    if (filteredWrapTokens.length === 0 && filteredWrapDomains.length === 0) {
      return [];
    }

    const oracleTableItems = await this.getOracleTableWrapItems();

    const events = [];
    // Use Action.wrapTokens from FIO SDK
    for (const action of filteredWrapTokens) {
      const { timestamp, act, trx_id, block_num } = action;
      const { amount, chain_code, public_address, actor } =
        act && act.data ? act.data : {};

      const oracleItem = oracleTableItems.find(
        item =>
          item.actor === actor &&
          item.chaincode === chain_code &&
          item.pubaddress === public_address &&
          new MathOp(item.amount).eq(amount) &&
          compareTimestampsWithThreshold(item.timestamp, timestamp + 'Z'),
      );

      events.push({
        action_type: Action.wrapTokens, // Using FIO SDK Action name
        block_number: block_num,
        transaction_id: trx_id,
        timestamp: new Date(timestamp + 'Z'),
        actor,
        action_data: act.data,
        oracle_id: oracleItem ? oracleItem.id : null,
      });
    }

    // Use Action.wrapDomain from FIO SDK
    for (const action of filteredWrapDomains) {
      const { timestamp, act, trx_id, block_num } = action;
      const { actor, chain_code, fio_domain, public_address } =
        act && act.data ? act.data : {};

      const oracleItem = oracleTableItems.find(
        item =>
          item.actor === actor &&
          item.chaincode === chain_code &&
          item.pubaddress === public_address &&
          item.nftname === fio_domain &&
          compareTimestampsWithThreshold(item.timestamp, timestamp + 'Z'),
      );

      events.push({
        action_type: Action.wrapDomain, // Using FIO SDK Action name
        block_number: block_num,
        transaction_id: trx_id,
        timestamp: new Date(timestamp + 'Z'),
        actor,
        action_data: act.data,
        oracle_id: oracleItem ? oracleItem.id : null,
      });
    }

    logger.info(
      `[FIO] Found ${filteredWrapTokens.length} wrap token and ${filteredWrapDomains.length} wrap domain actions`,
    );

    if (events.length > 0) {
      await WrapStatusFioChainEvents.addEvents(events);
    }
  }

  async processUnwrapActions({ fromBlock, toBlock }) {
    const logPrefix = '[FIO] Processing unwrap actions';
    logger.info(logPrefix);

    const limit = config.wrap.fioHistoryV2Offset;

    const unwrapTokenActions = await this.processActionsByName({
      actionName: Action.unwrapTokens,
      fromBlock,
      toBlock,
      limit,
    });
    const unwrapDomainActions = await this.processActionsByName({
      actionName: Action.unwrapDomain,
      fromBlock,
      toBlock,
      limit,
    });

    const events = [
      // Use Action.unwrapTokens from FIO SDK
      ...unwrapTokenActions.map(action => ({
        action_type: Action.unwrapTokens, // Using FIO SDK Action name
        block_number: action.block_num,
        transaction_id: action.trx_id,
        timestamp: new Date(action.timestamp + 'Z'),
        actor: action.act ? action.act.data.actor : null,
        action_data: action.act ? action.act.data : null,
        oracle_id: null,
      })),
      // Use Action.unwrapDomain from FIO SDK
      ...unwrapDomainActions.map(action => ({
        action_type: Action.unwrapDomain, // Using FIO SDK Action name
        block_number: action.block_num,
        transaction_id: action.trx_id,
        timestamp: new Date(action.timestamp + 'Z'),
        actor: action.act ? action.act.data.actor : null,
        action_data: action.act ? action.act.data : null,
        oracle_id: null,
      })),
    ];

    logger.info(
      `${logPrefix} Found ${unwrapTokenActions.length} unwrap token and ${unwrapDomainActions.length} unwrap domain actions`,
    );

    if (events.length > 0) {
      await WrapStatusFioChainEvents.addEvents(events);
    }
  }

  async processBurnedDomains({ fromBlock, toBlock }) {
    const logPrefix = '[FIO] Processing burned domains';
    logger.info(logPrefix);

    const params = {
      code: Account.address,
      scope: Account.address,
      after: fromBlock,
      before: toBlock,
      present: 0,
      table: 'domains',
      limit: config.wrap.fioHistoryV2Offset,
    };

    const getFioBurnedDomainsLogsAll = async ({ params: currentParams }) => {
      const burnedDomains = [];
      logger.info(
        `${logPrefix} Getting burned domains logs from ${currentParams.before} to ${currentParams.after}`,
      );
      const deltas = await this.getFioDeltasV2(currentParams);

      if (!deltas || !deltas.deltas || !deltas.deltas.length) {
        return burnedDomains;
      }

      const deltasLength = deltas.deltas.length;

      // Find only burned domains that was owned by fio.oracle account at that moment.
      const oracleBurnedDomains = deltas.deltas.filter(
        deltaItem =>
          deltaItem && deltaItem.data && deltaItem.data.account === Account.oracle,
      );

      burnedDomains.push(...oracleBurnedDomains);

      if (deltasLength) {
        // Check if we got all results
        if (
          deltas.total &&
          deltas.total.value &&
          new MathOp(deltasLength).eq(deltas.total.value)
        ) {
          return burnedDomains;
        }

        const lastDeltasItem = deltas.deltas[deltasLength - 1];
        if (lastDeltasItem && lastDeltasItem.block_num) {
          const updatedParams = {
            ...currentParams,
            before:
              deltasLength === 1
                ? lastDeltasItem.block_num - 1
                : lastDeltasItem.block_num,
          };

          // Recursively get more deltas
          const moreBurnedDomains = await getFioBurnedDomainsLogsAll({
            params: updatedParams,
          });
          burnedDomains.push(...moreBurnedDomains);
        }
      }

      return burnedDomains;
    };

    const unprocessedBurnedDomainsList = await getFioBurnedDomainsLogsAll({
      params,
    });

    logger.info(
      `${logPrefix} Found ${unprocessedBurnedDomainsList.length} burned domain deltas to process`,
    );

    // Find transaction id for specific action by block number. Because it is not presented on deltas v2.
    // Process in chunks to avoid rate limiting and ensure block data is available
    const processedBurnedDomains = [];
    const chunks = [];

    // Split items into chunks
    for (let i = 0; i < unprocessedBurnedDomainsList.length; i += this.chunkSize) {
      chunks.push(unprocessedBurnedDomainsList.slice(i, i + this.chunkSize));
    }

    logger.info(
      `${logPrefix} Processing ${unprocessedBurnedDomainsList.length} items in ${chunks.length} chunks`,
    );

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkResults = await Promise.allSettled(
        chunk.map(async (delta, chunkIndex) => {
          const globalIndex = i * this.chunkSize + chunkIndex;
          const previousItem =
            globalIndex > 0 ? unprocessedBurnedDomainsList[globalIndex - 1] : null;

          // If same block number as previous, add a delay to ensure block data is available
          if (previousItem && delta.block_num === previousItem.block_num) {
            await sleep(SECOND_MS * 3);
          }

          const blockData = await this.getBlockTransactions(delta.block_num);
          let trxId = null;

          const domainId = delta.data && delta.data.id ? delta.data.id : 'unknown';

          if (!blockData) {
            logger.warn(
              `${logPrefix} No block data found for block ${delta.block_num}, domain id: ${domainId}`,
            );
          } else if (!blockData.transactions || !blockData.transactions.length) {
            logger.warn(
              `${logPrefix} No transactions found in block ${delta.block_num}, domain id: ${domainId}`,
            );
          } else {
            // Match the old code's logic exactly: use find with boolean check
            const burnedDomainAction = blockData.transactions.find(
              ({ trx }) =>
                trx &&
                trx.id &&
                trx.transaction &&
                trx.transaction.actions &&
                !!trx.transaction.actions.find(
                  ({ name, data }) =>
                    (name === 'burndomain' || name === 'burnexpired') &&
                    new MathOp(data.offset).eq(delta.data.id),
                ),
            );

            if (burnedDomainAction) {
              trxId = burnedDomainAction.trx.id;
            } else {
              logger.warn(
                `${logPrefix} No matching burn action found in block ${delta.block_num} for domain id: ${domainId}`,
              );
            }
          }

          return {
            ...delta,
            trx_id: trxId,
          };
        }),
      );

      // Collect successful results and log failures
      chunkResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          processedBurnedDomains.push(result.value);
        } else {
          const errorMessage =
            result.reason && result.reason.message
              ? result.reason.message
              : result.reason;
          const itemIndex = i * this.chunkSize + index;
          logger.error(
            `${logPrefix} Failed to process item ${itemIndex}: ${errorMessage}`,
          );
        }
      });

      logger.info(
        `${logPrefix} Processed chunk ${i + 1}/${chunks.length} (${chunk.length} items)`,
      );

      // Add delay between chunks to prevent overwhelming the API
      if (i < chunks.length - 1) {
        await sleep(config.wrap.fioHistoryV2.chunkDelayMs || 100);
      }
    }

    // Deduplicate by transaction_id, but include items without transaction_id
    const seenTrxIds = new Set();
    const uniqueBurnedDomains = processedBurnedDomains.filter(item => {
      if (item.trx_id) {
        if (seenTrxIds.has(item.trx_id)) {
          return false;
        }
        seenTrxIds.add(item.trx_id);
      }
      return true;
    });

    const events = uniqueBurnedDomains.map(delta => ({
      action_type: 'burndomain', // Custom name, not from FIO SDK
      block_number: delta.block_num,
      transaction_id: delta.trx_id || null,
      timestamp: new Date(delta.timestamp),
      actor: Account.oracle,
      action_data: delta.data,
      oracle_id: null,
    }));

    logger.info(`${logPrefix} Found ${events.length} burned domain actions`);

    if (events.length > 0) {
      await WrapStatusFioChainEvents.addEvents(events);
    }
  }

  async processOravotes() {
    const logPrefix = '[FIO] Processing oracle votes';
    logger.info(logPrefix);

    const startPosition = await WrapStatusFioChainEvents.count({
      where: { action_type: 'oravote' },
    });
    const defaultLimit = config.wrap.oracleVotesLogsLimit;

    logger.info(`${logPrefix} Startingfrom position ${startPosition}`);

    const getFioOraclesVotes = async ({ startPosition, limit }) => {
      const params = {
        code: Account.oracle,
        scope: Account.oracle,
        table: 'oravotes',
        lower_bound: startPosition ? startPosition.toString() : '',
        limit,
        json: true,
      };

      const response = await this.rateLimiter.executeWithRetry(
        () =>
          fioApi.getTableRows({
            params,
            apiUrlType: FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_API,
          }),
        'FIO oracle votes',
      );

      if (!response || !response.rows || !response.rows.length) return [];

      return response.rows;
    };

    let limit = defaultLimit;
    let oravotesList = await getFioOraclesVotes({ startPosition, limit });
    while (oravotesList.length === limit) {
      limit += defaultLimit;
      logger.info(`${logPrefix} Increasing limit to ${limit}`);
      oravotesList = await getFioOraclesVotes({ startPosition, limit });
    }

    const events = oravotesList.map(row => ({
      action_type: 'oravote', // Custom name for oracle votes
      block_number: 0,
      transaction_id: null,
      timestamp: new Date(),
      actor: null,
      action_data: row,
      oracle_id: row.id,
    }));

    logger.info(`${logPrefix} Found ${events.length} oracle votes`);

    if (events.length > 0) {
      await WrapStatusFioChainEvents.addEvents(events);
    }
  }

  async processChain() {
    const lastProcessedBlock = await this.getLastProcessedBlock();
    const chainInfo = await this.getChainInfo();
    const currentBlock = chainInfo.last_irreversible_block_num;

    logger.info(`[FIO] Processing from block ${lastProcessedBlock} to ${currentBlock}`);

    if (lastProcessedBlock >= currentBlock) {
      logger.info('[FIO] Already up to date');
      return 0;
    }

    await this.processWrapActions({
      fromBlock: lastProcessedBlock,
      toBlock: currentBlock,
    });

    await this.processUnwrapActions({
      fromBlock: lastProcessedBlock,
      toBlock: currentBlock,
    });

    await this.processOravotes();

    await this.processBurnedDomains({
      fromBlock: lastProcessedBlock,
      toBlock: currentBlock,
    });

    await this.updateLastProcessedBlock(currentBlock);
  }
}
