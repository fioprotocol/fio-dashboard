import fs from 'fs';

import Sequelize from 'sequelize';
import Web3 from 'web3';
import superagent from 'superagent';

import { Account, Action } from '@fioprotocol/fiosdk';

import MathOp from '../services/math.mjs';
import { fioApi } from '../external/fio.mjs';

import '../db';

import CommonJob from './job.mjs';
import {
  FioApiUrl,
  Var,
  WrapStatusBlockNumbers,
  WrapStatusEthOraclesConfirmationsLogs,
  WrapStatusEthUnwrapLogs,
  WrapStatusEthWrapLogs,
  WrapStatusFioUnwrapNftsLogs,
  WrapStatusFioUnwrapNftsOravotes,
  WrapStatusFioUnwrapTokensLogs,
  WrapStatusFioUnwrapTokensOravotes,
  WrapStatusFioWrapNftsLogs,
  WrapStatusFioWrapTokensLogs,
  WrapStatusFioBurnedDomainsLogs,
  WrapStatusNetworks,
  WrapStatusPolygonOraclesConfirmationsLogs,
  WrapStatusPolygonUnwrapLogs,
  WrapStatusPolygonWrapLogs,
  WrapStatusPolygonBurnedDomainsLogs,
} from '../models/index.mjs';
import { WRAP_STATUS_NETWORKS_IDS, VARS_KEYS, SECOND_MS } from '../config/constants.js';
import config from '../config/index.mjs';
import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';
import { CHAIN_CODES } from '../constants/chain.mjs';
import { sleep } from '../tools.mjs';
import { fetchWithRateLimit, compareTimestampsWithThreshold } from '../utils/general.mjs';

const WRAPPED_DOMAIN_ABI = JSON.parse(
  fs.readFileSync('server/static-files/abi_fio_domain_nft.json', 'utf8'),
);
const WRAPPED_TOKEN_ABI = JSON.parse(
  fs.readFileSync('server/static-files/abi_fio_token.json', 'utf8'),
);
const UNWRAP_RETRIES_LIMIT = 5;
const UNWRAP_APPROVED_COUNT = 3;

class WrapStatusJob extends CommonJob {
  handleErrorMessage(message) {
    // eslint-disable-next-line no-console
    console.log(message);
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

  // example of getting all POLYGON smart contract events
  async test() {
    const web3 = new Web3(`${config.wrap.infuraBaseUrl}${process.env.INFURA_API_KEY}`);
    const blocksRangeLimit = parseInt(process.env.BLOCKS_RANGE_LIMIT_POLY);

    const fioNftContractOnPolygonChain = new web3.eth.Contract(
      WRAPPED_DOMAIN_ABI,
      config.wrap.fioNftPolygonContract,
    );

    const getPolygonActionsLogs = async (from, to) => {
      return await fioNftContractOnPolygonChain.getPastEvents(
        'allEvents', //'consensus_activity',
        {
          fromBlock: from,
          toBlock: to,
        },
        async (error, events) => {
          if (!error) {
            return events;
          } else {
            this.handleErrorMessage(error);
          }
        },
      );
    };

    const getUnprocessedActionsLogs = async () => {
      const logPrefix = 'Test >>>>>>>>>>';
      const lastProcessedBlockNumber = 28994555;
      const lastInChainBlockNumber = await web3.eth.getBlockNumber();

      if (lastProcessedBlockNumber > lastInChainBlockNumber)
        throw new Error(
          logPrefix + `Wrong start blockNumber value, pls check the database value.`,
        );

      let fromBlockNumber = lastProcessedBlockNumber + 1;

      let result = [];

      while (fromBlockNumber <= lastInChainBlockNumber) {
        const maxAllowedBlockNumber = fromBlockNumber + blocksRangeLimit - 1;
        const toBlockNumber =
          maxAllowedBlockNumber > lastInChainBlockNumber
            ? lastInChainBlockNumber
            : maxAllowedBlockNumber;

        result = [
          ...result,
          ...(await getPolygonActionsLogs(fromBlockNumber, toBlockNumber)),
        ];

        fromBlockNumber = toBlockNumber + 1;
      }

      return JSON.stringify(result, null, 2);
    };

    const data = await getUnprocessedActionsLogs();

    // eslint-disable-next-line no-console
    console.log(data);
  }

  async getPolygonLogs({ isWrap = false, isBurn = false }) {
    const logPrefix = `Get POLYGON Logs, isWrap: ${isWrap}, isBurn: ${isBurn} --> `;

    try {
      const web3 = new Web3(`${config.wrap.infuraBaseUrl}${process.env.INFURA_API_KEY}`);
      const blocksRangeLimit = parseInt(process.env.BLOCKS_RANGE_LIMIT_POLY);

      const fioNftContractOnPolygonChain = new web3.eth.Contract(
        WRAPPED_DOMAIN_ABI,
        config.wrap.fioNftPolygonContract,
      );

      const networkData = await WrapStatusNetworks.findOneWhere({
        id: WRAP_STATUS_NETWORKS_IDS.POLYGON,
      });
      let maxCheckedBlockNumber = 0;

      const getPolygonActionsLogs = async (from, to, isOraclesConfirmations = false) => {
        return await fioNftContractOnPolygonChain.getPastEvents(
          isOraclesConfirmations
            ? 'consensus_activity'
            : isWrap
            ? 'wrapped'
            : isBurn
            ? 'domainburned'
            : 'unwrapped',
          {
            fromBlock: from,
            toBlock: to,
          },
          async (error, events) => {
            if (!error) {
              return events;
            } else {
              this.handleErrorMessage(error);
            }
          },
        );
      };

      const getUnprocessedActionsLogs = async () => {
        const lastProcessedBlockNumber = await WrapStatusBlockNumbers.getBlockNumber(
          networkData.id,
          isWrap,
          isBurn,
        );

        const lastInChainBlockNumber = await web3.eth.getBlockNumber();

        if (lastProcessedBlockNumber > lastInChainBlockNumber)
          throw new Error(
            logPrefix + `Wrong start blockNumber value, pls check the database value.`,
          );

        this.postMessage(
          logPrefix + `starting from blockNumber: ${lastProcessedBlockNumber}`,
        );
        this.postMessage(logPrefix + `finish at blockNumber: ${lastInChainBlockNumber}`);

        let fromBlockNumber = lastProcessedBlockNumber + 1;

        const data = {
          transferActions: [],
          oraclesConfirmationActions: [],
        };

        // todo: check if possible to rewrite onto Promise.all async bunches process. Possible difficulties: 1) large amount of parallel request (server limitations, and Infura Api limitations); 2) configuring limitation value. Profit: much faster job's work for big ranges (but less reliable).
        while (fromBlockNumber <= lastInChainBlockNumber) {
          const maxAllowedBlockNumber = fromBlockNumber + blocksRangeLimit - 1;
          const toBlockNumber =
            maxAllowedBlockNumber > lastInChainBlockNumber
              ? lastInChainBlockNumber
              : maxAllowedBlockNumber;

          maxCheckedBlockNumber = toBlockNumber;

          const eventsWithTimestamps = [];

          const events = await await getPolygonActionsLogs(
            fromBlockNumber,
            toBlockNumber,
          );

          for (const event of events) {
            const { blockNumber } = event;
            const block = await web3.eth.getBlock(blockNumber);
            eventsWithTimestamps.push({
              ...event,
              blockTimeStamp: block.timestamp,
            });
          }

          data.transferActions = [...data.transferActions, ...eventsWithTimestamps];

          if (isWrap || isBurn) {
            const oracleEventsWithTimestamps = [];

            const oracleEvents = await getPolygonActionsLogs(
              fromBlockNumber,
              toBlockNumber,
              true,
            );

            for (const orcaleEvent of oracleEvents) {
              const { blockNumber } = orcaleEvent;
              const block = await web3.eth.getBlock(blockNumber);
              oracleEventsWithTimestamps.push({
                ...orcaleEvent,
                blockTimeStamp: block.timestamp,
              });
            }

            data.oraclesConfirmationActions = [
              ...data.oraclesConfirmationActions,
              ...oracleEventsWithTimestamps,
            ];
          }

          fromBlockNumber = toBlockNumber + 1;
        }

        this.postMessage(
          logPrefix +
            `result length: transfers: ${data.transferActions.length} ${
              isWrap || isBurn
                ? `oracles confirmations: ${data.oraclesConfirmationActions}`
                : ''
            }`,
        );
        return data;
      };

      const data = await getUnprocessedActionsLogs();

      if (data.transferActions.length > 0) {
        if (isWrap) {
          await WrapStatusPolygonWrapLogs.addLogs(data.transferActions);
        } else if (isBurn) {
          await WrapStatusPolygonBurnedDomainsLogs.addLogs(data.transferActions);
        } else {
          await WrapStatusPolygonUnwrapLogs.addLogs(data.transferActions);
        }
      }

      if (data.oraclesConfirmationActions.length > 0) {
        await WrapStatusPolygonOraclesConfirmationsLogs.addLogs(
          data.oraclesConfirmationActions,
        );
      }

      await WrapStatusBlockNumbers.setBlockNumber(
        maxCheckedBlockNumber,
        networkData.id,
        isWrap,
        isBurn,
      );

      this.postMessage(logPrefix + 'successfully finished');
      return data.transferActions.length;
    } catch (e) {
      this.handleErrorMessage(e);
    }
  }

  async getEthLogs(isWrap = false) {
    const logPrefix = `Get ETH Logs, isWrap: ${isWrap} --> `;
    try {
      const web3 = new Web3(`${config.wrap.ethBaseUrl}${process.env.INFURA_API_KEY}`);
      const blocksRangeLimit = parseInt(process.env.BLOCKS_RANGE_LIMIT_ETH);

      const fioTokenContractOnEthChain = new web3.eth.Contract(
        WRAPPED_TOKEN_ABI,
        config.wrap.fioTokenEthContract,
      );

      const networkData = await WrapStatusNetworks.findOneWhere({
        id: WRAP_STATUS_NETWORKS_IDS.ETH,
      });
      let maxCheckedBlockNumber = 0;

      const getEthActionsLogs = async (from, to, isOraclesConfirmations = false) => {
        return await fioTokenContractOnEthChain.getPastEvents(
          isOraclesConfirmations
            ? 'consensus_activity'
            : isWrap
            ? 'wrapped'
            : 'unwrapped',
          {
            fromBlock: from,
            toBlock: to,
          },
          async (error, events) => {
            if (!error) {
              return events;
            } else {
              this.handleErrorMessage(error);
            }
          },
        );
      };

      const getUnprocessedActionsLogs = async () => {
        const lastProcessedBlockNumber = await WrapStatusBlockNumbers.getBlockNumber(
          networkData.id,
          isWrap,
        );
        const lastInChainBlockNumber = await web3.eth.getBlockNumber();

        if (lastProcessedBlockNumber > lastInChainBlockNumber)
          throw new Error(
            logPrefix + `Wrong start blockNumber value, pls check the database value.`,
          );

        this.postMessage(
          logPrefix + `starting from blockNumber: ${lastProcessedBlockNumber}`,
        );
        this.postMessage(logPrefix + `finish at blockNumber: ${lastInChainBlockNumber}`);

        let fromBlockNumber = lastProcessedBlockNumber + 1;

        const data = {
          transferActions: [],
          oraclesConfirmationActions: [],
        };

        while (fromBlockNumber <= lastInChainBlockNumber) {
          const maxAllowedBlockNumber = fromBlockNumber + blocksRangeLimit - 1;
          const toBlockNumber =
            maxAllowedBlockNumber > lastInChainBlockNumber
              ? lastInChainBlockNumber
              : maxAllowedBlockNumber;

          maxCheckedBlockNumber = toBlockNumber;

          const eventsWithTimestamps = [];

          const events = await getEthActionsLogs(fromBlockNumber, toBlockNumber);

          for (const event of events) {
            const { blockNumber } = event;
            const block = await web3.eth.getBlock(blockNumber);
            eventsWithTimestamps.push({
              ...event,
              blockTimeStamp: block.timestamp,
            });
          }

          data.transferActions = [...data.transferActions, ...eventsWithTimestamps];

          if (isWrap) {
            const oracleEventsWithTimestamps = [];

            const oracleEvents = await getEthActionsLogs(
              fromBlockNumber,
              toBlockNumber,
              true,
            );

            for (const orcaleEvent of oracleEvents) {
              const { blockNumber } = orcaleEvent;
              const block = await web3.eth.getBlock(blockNumber);
              oracleEventsWithTimestamps.push({
                ...orcaleEvent,
                blockTimeStamp: block.timestamp,
              });
            }
            data.oraclesConfirmationActions = [
              ...data.oraclesConfirmationActions,
              ...oracleEventsWithTimestamps,
            ];
          }

          fromBlockNumber = toBlockNumber + 1;
        }

        this.postMessage(
          logPrefix +
            `result length: transfers: ${data.transferActions.length} ${
              isWrap
                ? `oracles confirmations: ${JSON.stringify(
                    data.oraclesConfirmationActions,
                  )}`
                : ''
            }`,
        );
        return data;
      };

      const data = await getUnprocessedActionsLogs();

      if (data.transferActions.length > 0) {
        if (isWrap) {
          await WrapStatusEthWrapLogs.addLogs(data.transferActions);
        } else await WrapStatusEthUnwrapLogs.addLogs(data.transferActions);
      }

      if (data.oraclesConfirmationActions.length > 0) {
        await WrapStatusEthOraclesConfirmationsLogs.addLogs(
          data.oraclesConfirmationActions,
        );
        await WrapStatusPolygonOraclesConfirmationsLogs.addLogs(
          data.oraclesConfirmationActions,
        );
      }

      await WrapStatusBlockNumbers.setBlockNumber(
        maxCheckedBlockNumber,
        networkData.id,
        isWrap,
      );

      this.postMessage(logPrefix + 'successfully finished');
      return data.transferActions.length;
    } catch (e) {
      this.handleErrorMessage(e);
    }
  }

  async getUnwrapOravotesLogs() {
    const logPrefix = `Get FIO Oravotes, Unwrap --> `;
    try {
      const getFioOraclesVotes = async (startPosition, limit) => {
        const res = await fioApi.getTableRows({
          params: {
            code: Account.oracle,
            scope: Account.oracle,
            table: 'oravotes',
            lower_bound: startPosition + '',
            limit,
            json: true,
          },
          apiUrlType: FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_API,
        });

        return res && res.rows ? res.rows : null;
      };

      const getUncompletedOracleVotes = async (Model, includeModel) => {
        const uncompletedUnwrapOravotes = await Model.findAll({
          where: {
            isComplete: {
              [Sequelize.Op.is]: false,
            },
          },
          include: [includeModel],
        });

        const uncompletedUnwrapOravotesWithFullApproved = uncompletedUnwrapOravotes
          .map(item => Model.format(item))
          .filter(
            item =>
              item[includeModel.name].length === UNWRAP_APPROVED_COUNT ||
              item.attempts < UNWRAP_RETRIES_LIMIT,
          );

        const oracleVotesList = await Promise.all(
          uncompletedUnwrapOravotesWithFullApproved.map(async item => {
            await Model.update(
              { attempts: item.attempts + 1 },
              { where: { id: item.id } },
            );

            return getFioOraclesVotes(item.id, 1);
          }),
        );

        return oracleVotesList.flat();
      };

      const getUnprocessedOracleVotes = async () => {
        const startPosition =
          ((await WrapStatusFioUnwrapNftsOravotes.count()) || 0) +
          ((await WrapStatusFioUnwrapTokensOravotes.count()) || 0);

        const defaultLimit = parseInt(process.env.ORACLE_VOTES_LOGS_LIMIT);

        this.postMessage(logPrefix + `Starting from position: ${startPosition}`);

        let limit = defaultLimit;
        let oracleVotesList = await getFioOraclesVotes(startPosition, limit);
        while (oracleVotesList.length === limit) {
          limit += defaultLimit;
          oracleVotesList = await getFioOraclesVotes(startPosition, limit);
        }

        return oracleVotesList;
      };

      const uncompletedNftsResults = await getUncompletedOracleVotes(
        WrapStatusFioUnwrapNftsOravotes,
        WrapStatusFioUnwrapNftsLogs,
      );
      const uncompletedTokensResults = await getUncompletedOracleVotes(
        WrapStatusFioUnwrapTokensOravotes,
        WrapStatusFioUnwrapTokensLogs,
      );
      const result = await getUnprocessedOracleVotes();

      const unwrapNfts = [];
      const unwrapTokens = [];

      [...uncompletedNftsResults, ...uncompletedTokensResults, ...result].forEach(
        logItem => {
          if (logItem.nftname && logItem.nftname.length > 1) {
            unwrapNfts.push(logItem);
          } else {
            unwrapTokens.push(logItem);
          }
        },
      );

      this.postMessage(logPrefix + `unwrapTokens result length: ${unwrapTokens.length}`);
      this.postMessage(logPrefix + `unwrapNfts result length: ${unwrapNfts.length}`);

      if (unwrapNfts.length > 0)
        await WrapStatusFioUnwrapNftsOravotes.addLogs(unwrapNfts);
      if (unwrapTokens.length > 0)
        await WrapStatusFioUnwrapTokensOravotes.addLogs(unwrapTokens);

      this.postMessage(logPrefix + 'successfully finished');
    } catch (e) {
      this.handleErrorMessage(e);
    }
  }

  async getFioLogs() {
    const logPrefix = `Get FIO Logs --> `;
    try {
      const networkData = await WrapStatusNetworks.findOneWhere({
        id: WRAP_STATUS_NETWORKS_IDS.FIO,
      });

      const lastProcessedBlockNumber = await WrapStatusBlockNumbers.getBlockNumber(
        networkData.id,
        true,
      );

      this.postMessage(
        logPrefix + `searching for blocks starting from: ${lastProcessedBlockNumber}`,
      );

      const FIO_HISTORY_LIMIT = await Var.getValByKey(VARS_KEYS.FIO_HISTORY_LIMIT);

      const getChainInfo = async () => {
        const urls = this.fioActionUrls;
        let response = null;
        for (const url of urls) {
          try {
            const res = await superagent.get(`${url}chain/get_info`);
            response = res.body;
            break;
          } catch (error) {
            this.postMessage(`Get chain info ${url} error ${error.message}`);
          }
        }

        return response;
      };

      const chainInfo = await getChainInfo();
      const toBlockNum = chainInfo.last_irreversible_block_num;

      const getBlockTransactions = async blockNumber => {
        const urls = this.fioActionUrls;
        let response = null;

        for (const url of urls) {
          try {
            const res = await superagent
              .post(`${url}chain/get_block`)
              .send({ block_num_or_id: blockNumber });
            response = res.body;
            break;
          } catch (error) {
            this.postMessage(
              `Get Block Transaction IDs ${blockNumber} ${url} error ${error.message}`,
            );
          }
        }

        return response;
      };

      const getFioActionsV2Logs = async params => {
        const urls = this.fioHistoryV2Urls;
        let response = null;
        for (const url of urls) {
          try {
            const queryString = new URLSearchParams(params).toString();

            const res = await fetchWithRateLimit({
              url: `${url}history/get_actions?${queryString}`,
            });

            response = res.json();
            break;
          } catch (error) {
            this.postMessage(`Failed to fetch from ${url}: ${error.message}`);
          }
        }

        return response;
      };

      const getFioDeltasLogs = async params => {
        const urls = this.fioHistoryV2Urls;
        let response = null;

        for (const url of urls) {
          try {
            const res = await superagent.get(`${url}history/get_deltas`).query(params);
            response = res.body;
          } catch (error) {
            this.postMessage(`Failed to fetch from V2 ${url}: ${error.message}`);
          }
        }

        return response;
      };

      const getUnporcessedBurnDomainActionsOnFioChain = async () => {
        this.postMessage(`${logPrefix} Searching for Burned Domains`);

        const unprocessedBurnedDomainsList = [];
        const DEFAULT_V2_ITEMS_LIMIT_PER_REQUEST = parseInt(
          process.env.WRAP_STATUS_PAGE_FIO_HISTORY_V2_OFFSET,
        );

        const after = lastProcessedBlockNumber;
        const before = chainInfo.last_irreversible_block_num;

        const paramsToPass = {
          code: Account.address,
          scope: Account.address,
          after,
          before,
          present: 0,
          table: 'domains',
          limit: DEFAULT_V2_ITEMS_LIMIT_PER_REQUEST,
        };

        const getFioBurnedDomainsLogsAll = async ({ params }) => {
          const burnedDomainsLogs = await getFioDeltasLogs(params);

          if (
            burnedDomainsLogs &&
            burnedDomainsLogs.deltas &&
            burnedDomainsLogs.deltas.length
          ) {
            const deltasLength = burnedDomainsLogs.deltas.length;

            // Find only burned domains that was owned by fio.oracle account at that moment.
            unprocessedBurnedDomainsList.push(
              ...burnedDomainsLogs.deltas.filter(
                deltaItem => deltaItem.data.account === 'fio.oracle',
              ),
            );

            if (deltasLength) {
              if (new MathOp(deltasLength).eq(burnedDomainsLogs.total.value)) {
                return;
              }
              const lastDeltasItem = burnedDomainsLogs.deltas[deltasLength - 1];
              if (lastDeltasItem && lastDeltasItem.block_num) {
                params.before =
                  deltasLength === 1
                    ? lastDeltasItem.block_num - 1
                    : lastDeltasItem.block_num;
              }
              // Add 1 second timeout to avoid 429 Too many requests error
              await sleep(SECOND_MS);

              await getFioBurnedDomainsLogsAll({ params });
            }
          }
        };

        await getFioBurnedDomainsLogsAll({
          params: paramsToPass,
        });

        // Find transaction id for specific action by block number. Because it is not presented on deltas v2.
        for (let i = 0; i < unprocessedBurnedDomainsList.length; i++) {
          const unprocessedBurnDomainItem = unprocessedBurnedDomainsList[i];
          const previousUnprocessedBurnDomainItem =
            i > 0 ? unprocessedBurnedDomainsList[i - 1] : null;

          if (
            previousUnprocessedBurnDomainItem &&
            unprocessedBurnDomainItem.block_num ===
              previousUnprocessedBurnDomainItem.block_num
          ) {
            // if blocknumbers are the same we need to wait around 3 seconds to fetch block data again. If not wait returns empty object.
            await sleep(SECOND_MS * 3);
          }
          const blockData = await getBlockTransactions(
            unprocessedBurnDomainItem.block_num,
          );

          if (blockData && blockData.transactions && blockData.transactions.length) {
            const burnedDomainAction = blockData.transactions.find(
              ({ trx }) =>
                trx.id &&
                trx.transaction &&
                trx.transaction.actions &&
                !!trx.transaction.actions.find(
                  ({ name, data }) =>
                    (name === 'burndomain' || name === 'burnexpired') &&
                    new MathOp(data.offset).eq(unprocessedBurnDomainItem.data.id),
                ),
            );

            if (burnedDomainAction) {
              unprocessedBurnDomainItem.trx_id = burnedDomainAction.trx.id;
            }
          }
        }

        const seenTrxIds = new Set();
        const unprocessedBurnedDomainsListNonDuplicate = unprocessedBurnedDomainsList.filter(
          item => {
            if (seenTrxIds.has(item.trx_id)) {
              return false;
            } else {
              seenTrxIds.add(item.trx_id);
              return true;
            }
          },
        );
        return unprocessedBurnedDomainsListNonDuplicate;
      };

      const getFioActionLogsAll = async ({ params, actionLogsList = [] }) => {
        const actionLogs = await getFioActionsV2Logs({
          ...params,
          block_num: `${params.fromBlockNum}-${params.toBlockNum}`,
        });

        if (actionLogs && actionLogs.actions && actionLogs.actions.length) {
          actionLogsList = [...actionLogsList, ...actionLogs.actions];

          if (
            actionLogs.total &&
            actionLogs.total.value &&
            new MathOp(actionLogs.total.value).gt(actionLogs.actions.length)
          ) {
            const lastActionLogItem = actionLogs.actions[actionLogs.actions.length - 1];
            // Add 1 second timeout to decrease 429 Too many requests error
            await sleep(SECOND_MS);

            return await getFioActionLogsAll({
              params: { ...params, toBlockNum: lastActionLogItem.block_num },
              actionLogsList,
            });
          }
        }

        // Avoiding duplications. If we will decrement toBlockNum parameter we could miss actions in next call if they had the same block number.
        const uniqueActions = Object.values(
          actionLogsList.reduce((acc, action) => {
            // Keep the latest action for each trx_id
            acc[action.trx_id] = action;
            return acc;
          }, {}),
        );

        return uniqueActions;
      };

      const getFioOracleTableWrapItems = async ({
        oracleItems,
        lowerBound,
        upperBound,
      }) => {
        const tableRowsParams = {
          json: true,
          code: Account.oracle,
          limit: FIO_HISTORY_LIMIT,
          scope: Account.oracle,
          table: 'oracleldgrs',
          reverse: true,
        };

        if (lowerBound) {
          tableRowsParams.lower_bound = lowerBound;
        }

        if (upperBound) {
          tableRowsParams.upper_bound = upperBound;
        }

        const response = await fioApi.getTableRows({
          params: tableRowsParams,
          apiUrlType: FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_API,
        });

        try {
          if (!response || !response.rows || response.rows.length === 0) {
            return oracleItems;
          }

          const { rows, more } = response;
          const updatedItems = [...oracleItems, ...rows];

          if (!more) {
            return updatedItems;
          }

          const lastRow = rows[rows.length - 1];

          // Add 1 second timeout to decrease 429 Too many requests error
          await sleep(SECOND_MS);

          return getFioOracleTableWrapItems({
            oracleItems: updatedItems,
            lowerBound,
            upperBound: lastRow.id - 1,
          });
        } catch (error) {
          this.handleErrorMessage(error);
          throw error;
        }
      };

      const handleFioWraps = async () => {
        try {
          const wrapTokensLogs = [];
          const wrapDomainLogs = [];

          const handleFioWrapTokensLogs = async () => {
            const params = {
              account: Account.oracle,
              checkLib: true,
              fromBlockNum: lastProcessedBlockNumber,
              limit: FIO_HISTORY_LIMIT,
              toBlockNum,
              'act.name': Action.wrapTokens,
            };
            const wrapTokenActionLogs = await getFioActionLogsAll({ params });

            if (wrapTokenActionLogs && wrapTokenActionLogs.length) {
              wrapTokensLogs.push(
                ...wrapTokenActionLogs.filter(
                  ({ act }) => act && act.data && act.data.chain_code === CHAIN_CODES.ETH, // Filtering only by ETH wrap actions. At this time not acceptible to have other chains.
                ),
              );
            }
          };

          const handleFioWrapDomains = async () => {
            const params = {
              account: Account.oracle,
              fromBlockNum: lastProcessedBlockNumber,
              checkLib: true,
              limit: FIO_HISTORY_LIMIT,
              toBlockNum,
              'act.name': Action.wrapDomain,
            };
            const wrapDomainActionLogs = await getFioActionLogsAll({ params });

            if (wrapDomainActionLogs && wrapDomainActionLogs.length) {
              wrapDomainLogs.push(
                ...wrapDomainActionLogs.filter(
                  ({ act }) =>
                    act &&
                    act.data &&
                    (act.data.chain_code === CHAIN_CODES.MATIC || // Filtering by MATIC (legacy) or POL actions. At this time not acceptible to have other chains.
                      act.data.chain_code === CHAIN_CODES.POL),
                ),
              );
            }
          };

          await handleFioWrapTokensLogs();
          await handleFioWrapDomains();

          if (wrapTokensLogs.length || wrapDomainLogs.length) {
            // Getting oracle table rows to match oracle id with wraped item
            const oracleTableItems = await getFioOracleTableWrapItems({
              oracleItems: [],
            });

            if (wrapTokensLogs.length > 0) {
              for (const wrapTokensItem of wrapTokensLogs) {
                const { timestamp, act } = wrapTokensItem;
                const {
                  data: { amount, chain_code, public_address, actor },
                } = act || {};
                const existingOracleTableItem = oracleTableItems.find(
                  ({
                    actor: oracleItemActor,
                    chaincode: oracleItemChainCode,
                    pubaddress: oracleItemPublicAddress,
                    amount: oracleItemAmount,
                    timestamp: oracleItemTimestamp,
                  }) =>
                    oracleItemActor === actor &&
                    oracleItemChainCode === chain_code &&
                    oracleItemPublicAddress === public_address &&
                    new MathOp(oracleItemAmount).eq(amount) &&
                    compareTimestampsWithThreshold(oracleItemTimestamp, timestamp + 'Z'), // Time of transaction and table row time could be different. In most cases it is the same but could be difference in 1 sec. If more - skip.
                );

                if (existingOracleTableItem) {
                  wrapTokensItem.oracleId = existingOracleTableItem.id;
                }
              }
              await WrapStatusFioWrapTokensLogs.addLogs(wrapTokensLogs);
            }
            if (wrapDomainLogs.length > 0) {
              for (const wrapDomainItem of wrapDomainLogs) {
                const { timestamp, act } = wrapDomainItem;
                const {
                  data: { actor, chain_code, fio_domain, public_address },
                } = act || {};
                const existingOracleTableItem = oracleTableItems.find(
                  ({
                    actor: oracleItemActor,
                    chaincode: oracleItemChainCode,
                    pubaddress: oracleItemPublicAddress,
                    nftname,
                    timestamp: oracleItemTimestamp,
                  }) =>
                    oracleItemActor === actor &&
                    oracleItemChainCode === chain_code &&
                    oracleItemPublicAddress === public_address &&
                    nftname === fio_domain &&
                    compareTimestampsWithThreshold(oracleItemTimestamp, timestamp + 'Z'),
                );

                if (existingOracleTableItem) {
                  wrapDomainItem.oracleId = existingOracleTableItem.id;
                }
              }
              await WrapStatusFioWrapNftsLogs.addLogs(wrapDomainLogs);
            }
          }

          this.postMessage(
            logPrefix + `wrapTokens result length: ${wrapTokensLogs.length}`,
          );
          this.postMessage(
            logPrefix + `wrapDomains result length: ${wrapDomainLogs.length}`,
          );
        } catch (error) {
          this.handleErrorMessage(error);
        }
      };

      const handleUnwrapTokens = async () => {
        const unwrapTokensLogs = [];

        const handleFioUnwrapTokensLogs = async () => {
          const params = {
            account: Account.oracle,
            checkLib: true,
            fromBlockNum: lastProcessedBlockNumber,
            limit: FIO_HISTORY_LIMIT,
            toBlockNum,
            'act.name': 'unwraptokens',
          };
          const unwrapTokenActionLogs = await getFioActionLogsAll({ params });

          if (unwrapTokenActionLogs && unwrapTokenActionLogs.length) {
            unwrapTokensLogs.push(...unwrapTokenActionLogs);
          }
        };

        await handleFioUnwrapTokensLogs();

        if (unwrapTokensLogs.length > 0) {
          await WrapStatusFioUnwrapTokensLogs.addLogs(unwrapTokensLogs);
        }

        this.postMessage(
          logPrefix + `unwrapTokens result length: ${unwrapTokensLogs.length}`,
        );
      };

      const handleUnwrapDomains = async () => {
        const unwrapDomainLogs = [];

        const handleFioUnwrapTokensLogs = async () => {
          const params = {
            account: Account.oracle,
            checkLib: true,
            fromBlockNum: lastProcessedBlockNumber,
            limit: FIO_HISTORY_LIMIT,
            toBlockNum,
            'act.name': 'unwrapdomain',
          };
          const unwrapTokenActionLogs = await getFioActionLogsAll({ params });

          if (unwrapTokenActionLogs && unwrapTokenActionLogs.length) {
            unwrapDomainLogs.push(...unwrapTokenActionLogs);
          }
        };

        await handleFioUnwrapTokensLogs();

        if (unwrapDomainLogs.length > 0) {
          await WrapStatusFioUnwrapNftsLogs.addLogs(unwrapDomainLogs);
        }

        this.postMessage(
          logPrefix + `unwrapDomains result length: ${unwrapDomainLogs.length}`,
        );
      };

      const handleBurnedDomains = async () => {
        const burnedDomainActionLogs = await getUnporcessedBurnDomainActionsOnFioChain();

        this.postMessage(
          `${logPrefix} burnedDomains result length: ${burnedDomainActionLogs.length}`,
        );
        if (burnedDomainActionLogs.length > 0)
          await WrapStatusFioBurnedDomainsLogs.addLogs(burnedDomainActionLogs);
      };

      await handleFioWraps();
      await handleUnwrapTokens();
      await handleUnwrapDomains();
      await handleBurnedDomains();

      await WrapStatusBlockNumbers.setBlockNumber(toBlockNum, networkData.id, true);

      this.postMessage(logPrefix + 'successfully finished');
    } catch (e) {
      this.handleErrorMessage(e);
    }
  }

  async execute() {
    this.postMessage(
      `Starting... If there are a lot of unprocessed data, it may take some time to get it.`,
    );

    this.fioActionUrls = await this.getActionUrls();
    this.fioHistoryV2Urls = await this.getHistoryV2Urls();

    await this.executeActions([
      this.getPolygonLogs.bind(this, { isWrap: true }),
      this.getPolygonLogs.bind(this, { isWrap: false }),
      this.getPolygonLogs.bind(this, { isBurn: true }),
      this.getEthLogs.bind(this, true),
      this.getEthLogs.bind(this, false),
      this.getUnwrapOravotesLogs.bind(this),
      this.getFioLogs.bind(this),
      // this.test,
    ]);

    this.finish();
  }
}

new WrapStatusJob().execute();
