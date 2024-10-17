import fs from 'fs';

import Sequelize from 'sequelize';
import Web3 from 'web3';
import superagent from 'superagent';

import { Account } from '@fioprotocol/fiosdk';

import MathOp from '../services/math.mjs';
import { fioApi } from '../external/fio.mjs';

import '../db';

import CommonJob from './job.mjs';
import {
  FioApiUrl,
  WrapStatusBlockNumbers,
  WrapStatusEthOraclesConfirmationsLogs,
  WrapStatusEthUnwrapLogs,
  WrapStatusEthWrapLogs,
  WrapStatusFioHistoryOffsetParams,
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
import { WRAP_STATUS_NETWORKS_IDS } from '../config/constants.js';
import config from '../config/index.mjs';
import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';
import { sleep } from '../tools.mjs';

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

  async getHistoryUrls() {
    const fioHistoryUrls = await FioApiUrl.findAll({
      where: { type: FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_HISTORY_URL },
    });

    return fioHistoryUrls.map(fioHistoryItem => fioHistoryItem.url);
  }

  async getHistoryV2Urls() {
    const fioHistoryV2Urls = await FioApiUrl.findAll({
      where: { type: FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_HISTORY_V2_URL },
    });

    return fioHistoryV2Urls.map(fioHistoryV2Item => fioHistoryV2Item.url);
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

  async getFioLogs({ accountName }) {
    const logPrefix = `Get FIO Logs for account name ${accountName} --> `;
    try {
      const accountActionSequence = await WrapStatusFioHistoryOffsetParams.getAccountActionSequence(
        { accountName },
      );

      const networkData = await WrapStatusNetworks.findOneWhere({
        id: WRAP_STATUS_NETWORKS_IDS.FIO,
      });

      const lastProcessedBlockNumber = await WrapStatusBlockNumbers.getBlockNumber(
        networkData.id,
        true,
      );

      let lastProcessedAccountActionSequence;

      const getChainInfo = async () => {
        const urls = this.fioHistoryUrls;
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

      const getBlockTransactionIds = async blockNumber => {
        const urls = this.fioHistoryUrls;
        let response = null;
        for (const url of urls) {
          try {
            const res = await superagent
              .post(`${url}history/get_block_txids`)
              .send({ block_num: blockNumber });
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

      const getTransaction = async trxId => {
        const urls = this.fioHistoryUrls;
        let response = null;
        for (const url of urls) {
          try {
            const res = await superagent
              .post(`${url}history/get_transaction`)
              .send({ id: trxId });
            response = res.body;
            break;
          } catch (error) {
            this.postMessage(`Get Transaction ${trxId} ${url} error ${error.message}`);
          }
        }

        return response;
      };

      const getFioActionsLogs = async ({ pos, offset }) => {
        const urls = this.fioHistoryUrls;
        let response = null;
        for (const url of urls) {
          try {
            const res = await superagent.post(`${url}history/get_actions`).send({
              account_name: accountName,
              pos,
              offset,
            });
            response = res.body;
            break;
          } catch (error) {
            this.postMessage(`Failed to fetch from ${url}: ${error.message}`);
          }
        }

        return response;
      };

      const getFioActionsLogsV2 = async params => {
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

        const getFioBurnedDomainsLogsAll = async ({ params, shouldSetBlockNumber }) => {
          const burnedDomainsLogs = await getFioActionsLogsV2(params);

          if (
            burnedDomainsLogs &&
            burnedDomainsLogs.deltas &&
            burnedDomainsLogs.deltas.length
          ) {
            const deltasLength = burnedDomainsLogs.deltas.length;

            unprocessedBurnedDomainsList.push(
              ...burnedDomainsLogs.deltas.filter(
                deltaItem => deltaItem.data.account === 'fio.oracle',
              ),
            );

            shouldSetBlockNumber &&
              burnedDomainsLogs.deltas[0] &&
              burnedDomainsLogs.deltas[0].block_num &&
              (await WrapStatusBlockNumbers.setBlockNumber(
                burnedDomainsLogs.deltas[0].block_num,
                networkData.id,
                true,
              ));

            if (deltasLength) {
              const lastDeltasItem = burnedDomainsLogs.deltas[deltasLength - 1];
              if (lastDeltasItem && lastDeltasItem.block_num) {
                params.before =
                  deltasLength === 1
                    ? lastDeltasItem.block_num - 1
                    : lastDeltasItem.block_num;
              }
              // Add 1 second timeout to avoid 429 Too many requests error
              await sleep(1000);

              await getFioBurnedDomainsLogsAll({ params });
            }
          } else {
            if (after > 0) {
              await WrapStatusBlockNumbers.setBlockNumber(before, networkData.id, true);
            }
          }
        };

        await getFioBurnedDomainsLogsAll({
          params: paramsToPass,
          shouldSetBlockNumber: true,
        });

        for (const unprocessedBurnDomainItem of unprocessedBurnedDomainsList) {
          const blockTxIds = await getBlockTransactionIds(
            unprocessedBurnDomainItem.block_num,
          );

          if (blockTxIds && blockTxIds.ids && blockTxIds.ids.length) {
            for (const blockTxIdItem of blockTxIds.ids) {
              const blockTxData = await getTransaction(blockTxIdItem);

              if (blockTxData && blockTxData.traces && blockTxData.traces.length) {
                const burnedDomainAction = blockTxData.traces.find(
                  traceItem =>
                    traceItem.act &&
                    traceItem.act.name &&
                    (traceItem.act.name === 'burndomain' ||
                      traceItem.act.name === 'burnexpired'),
                );

                if (burnedDomainAction) {
                  unprocessedBurnDomainItem.trx_id = burnedDomainAction.trx_id;
                }
              }
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

      const getUnprocessedActionsOnFioChain = async () => {
        const offsetRange = parseInt(config.wrap.fioHistoryOffset);

        this.postMessage(
          logPrefix +
            `searching for blocks after Account Action Sequence: ${accountActionSequence}`,
        );

        const unprocessedActionsList = [];

        const getFioActionsLogsAll = async ({ pos, actionsList }) => {
          const actionsLogsResult = await getFioActionsLogs({
            pos,
            offset: offsetRange,
          });

          const actionsLogsLength =
            actionsLogsResult &&
            actionsLogsResult.actions &&
            actionsLogsResult.actions.length
              ? actionsLogsResult.actions.length
              : 0;

          const actionTraceHasNonIrreversibleBlockIndex =
            actionsLogsResult && actionsLogsResult.actions
              ? actionsLogsResult.actions.findIndex(actionItem =>
                  new MathOp(actionItem.block_num).gt(
                    actionsLogsResult.last_irreversible_block,
                  ),
                )
              : null;

          if (
            actionsLogsResult &&
            actionsLogsResult.last_irreversible_block &&
            actionsLogsResult.actions &&
            actionsLogsLength > 0 &&
            actionTraceHasNonIrreversibleBlockIndex < 0
          ) {
            actionsList.push(...actionsLogsResult.actions);
            lastProcessedAccountActionSequence =
              actionsList[actionsList.length - 1].account_action_seq;
            await getFioActionsLogsAll({ pos: pos + actionsLogsLength, actionsList });
          }

          if (actionTraceHasNonIrreversibleBlockIndex >= 0) {
            actionsList.push(
              ...actionsLogsResult.actions.slice(
                0,
                actionTraceHasNonIrreversibleBlockIndex,
              ),
            );

            lastProcessedAccountActionSequence =
              actionTraceHasNonIrreversibleBlockIndex > 0
                ? actionsLogsResult.actions[actionTraceHasNonIrreversibleBlockIndex - 1]
                    .account_action_seq
                : lastProcessedAccountActionSequence;
          }
        };

        try {
          await getFioActionsLogsAll({
            pos:
              accountActionSequence > 0
                ? new MathOp(accountActionSequence).add(1).toNumber()
                : accountActionSequence,
            actionsList: unprocessedActionsList,
          });
        } catch (error) {
          this.postMessage(`${logPrefix} Error: ${error}`);
        }

        return unprocessedActionsList.filter(
          elem =>
            (elem.action_trace.act.name === 'wraptokens' &&
              elem.action_trace.act.data.chain_code === 'ETH') ||
            (elem.action_trace.act.name === 'wrapdomain' &&
              (elem.action_trace.act.data.chain_code === 'MATIC' ||
                elem.action_trace.act.data.chain_code === 'POL')) ||
            elem.action_trace.act.name === 'unwraptokens' ||
            elem.action_trace.act.name === 'unwrapdomain',
        );
      };

      const logs = await getUnprocessedActionsOnFioChain();
      const burnedDomainsLogs = await getUnporcessedBurnDomainActionsOnFioChain();

      const wrapDomainLogs = [];
      const wrapTokensLogs = [];
      const unwrapDomainLogs = [];
      const unwrapTokensLogs = [];

      logs.forEach(logItem => {
        if (logItem.action_trace.act.name === 'wraptokens') wrapTokensLogs.push(logItem);
        if (logItem.action_trace.act.name === 'wrapdomain') wrapDomainLogs.push(logItem);
        if (logItem.action_trace.act.name === 'unwraptokens')
          unwrapTokensLogs.push(logItem);
        if (logItem.action_trace.act.name === 'unwrapdomain')
          unwrapDomainLogs.push(logItem);
      });

      this.postMessage(
        logPrefix + `unwrapTokens result length: ${unwrapTokensLogs.length}`,
      );
      this.postMessage(
        logPrefix + `unwrapDomains result length: ${unwrapDomainLogs.length}`,
      );
      this.postMessage(logPrefix + `wrapTokens result length: ${wrapTokensLogs.length}`);
      this.postMessage(logPrefix + `wrapDomains result length: ${wrapDomainLogs.length}`);
      this.postMessage(
        logPrefix + `burnedDomains result length: ${burnedDomainsLogs.length}`,
      );

      if (unwrapDomainLogs.length > 0) {
        await WrapStatusFioUnwrapNftsLogs.addLogs(unwrapDomainLogs);
      }
      if (unwrapTokensLogs.length > 0) {
        await WrapStatusFioUnwrapTokensLogs.addLogs(unwrapTokensLogs);
      }
      if (wrapDomainLogs.length > 0) {
        await WrapStatusFioWrapNftsLogs.addLogs(wrapDomainLogs);
      }
      if (wrapTokensLogs.length > 0)
        await WrapStatusFioWrapTokensLogs.addLogs(wrapTokensLogs);
      if (burnedDomainsLogs.length > 0)
        await WrapStatusFioBurnedDomainsLogs.addLogs(burnedDomainsLogs);
      if (
        lastProcessedAccountActionSequence &&
        lastProcessedAccountActionSequence > accountActionSequence
      ) {
        await WrapStatusFioHistoryOffsetParams.setActionSequence({
          accountName,
          accountActionSequenceValue: lastProcessedAccountActionSequence,
        });
      }

      this.postMessage(logPrefix + 'successfully finished');
    } catch (e) {
      this.handleErrorMessage(e);
    }
  }

  async execute() {
    this.postMessage(
      `Starting... If there are a lot of unprocessed data, it may take some time to get it.`,
    );

    this.fioHistoryUrls = await this.getHistoryUrls();
    this.fioHistoryV2Urls = await this.getHistoryV2Urls();

    await this.executeActions([
      this.getPolygonLogs.bind(this, { isWrap: true }),
      this.getPolygonLogs.bind(this, { isWrap: false }),
      this.getPolygonLogs.bind(this, { isBurn: true }),
      this.getEthLogs.bind(this, true),
      this.getEthLogs.bind(this, false),
      this.getUnwrapOravotesLogs.bind(this),
      this.getFioLogs.bind(this, { accountName: 'fio.oracle' }),
      this.getFioLogs.bind(this, { accountName: 'fio.address' }),
      // this.test,
    ]);

    this.finish();
  }
}

new WrapStatusJob().execute();
