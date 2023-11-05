import fs from 'fs';

import Sequelize from 'sequelize';
import Web3 from 'web3';
import superagent from 'superagent';

import '../db';

import CommonJob from './job.mjs';
import {
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
  WrapStatusNetworks,
  WrapStatusPolygonOraclesConfirmationsLogs,
  WrapStatusPolygonUnwrapLogs,
  WrapStatusPolygonWrapLogs,
} from '../models/index.mjs';
import { WRAP_STATUS_NETWORKS_IDS } from '../config/constants.js';

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

  // example of getting all POLYGON smart contract events
  async test() {
    const web3 = new Web3(
      `${process.env.POLYGON_INFURA_BASE_URL}${process.env.INFURA_API_KEY}`,
    );
    const blocksRangeLimit = parseInt(process.env.BLOCKS_RANGE_LIMIT_POLY);

    const fioNftContractOnPolygonChain = new web3.eth.Contract(
      WRAPPED_DOMAIN_ABI,
      process.env.FIO_NFT_POLYGON_CONTRACT,
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

  async getPolygonLogs(isWrap = false) {
    const logPrefix = `Get POLYGON Logs, isWrap: ${isWrap} --> `;

    try {
      const web3 = new Web3(
        `${process.env.POLYGON_INFURA_BASE_URL}${process.env.INFURA_API_KEY}`,
      );
      const blocksRangeLimit = parseInt(process.env.BLOCKS_RANGE_LIMIT_POLY);

      const fioNftContractOnPolygonChain = new web3.eth.Contract(
        WRAPPED_DOMAIN_ABI,
        process.env.FIO_NFT_POLYGON_CONTRACT,
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

          if (isWrap) {
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
              isWrap ? `oracles confirmations: ${data.oraclesConfirmationActions}` : ''
            }`,
        );
        return data;
      };

      const data = await getUnprocessedActionsLogs();

      if (data.transferActions.length > 0) {
        if (isWrap) {
          await WrapStatusPolygonWrapLogs.addLogs(data.transferActions);
        } else await WrapStatusPolygonUnwrapLogs.addLogs(data.transferActions);
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
      const web3 = new Web3(
        `${process.env.ETH_INFURA_BASE_URL}${process.env.INFURA_API_KEY}`,
      );
      const blocksRangeLimit = parseInt(process.env.BLOCKS_RANGE_LIMIT_ETH);

      const fioTokenContractOnEthChain = new web3.eth.Contract(
        WRAPPED_TOKEN_ABI,
        process.env.FIO_TOKEN_ETH_CONTRACT,
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
              isWrap ? `oracles confirmations: ${data.oraclesConfirmationActions}` : ''
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
        const res = await superagent
          .post(`${process.env.FIO_BASE_URL}chain/get_table_rows`)
          .send({
            code: 'fio.oracle',
            scope: 'fio.oracle',
            table: 'oravotes',
            lower_bound: startPosition + '',
            limit,
            json: true,
          });

        if (res.statusCode === 200) {
          return res.body.rows;
        }
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
        true, // not make any diff (in db by default true), because service will get both wrap/unwrap logs
      );
      let maxBlockNumber;

      const getFioActionsLogs = async offset => {
        // get logs starting from the end of the FIO chain (pos = -1)
        const data = await superagent
          .post(`${process.env.FIO_HISTORY_URL}history/get_actions`)
          .send({ account_name: 'fio.oracle', pos: -1, offset });

        if (data.statusCode === 200) {
          const dataLength = Object.keys(data.body.actions).length;
          const result = [];
          for (let i = 0; i < dataLength; i++) {
            result.push(data.body.actions[i]);
          }
          return result;
        }
      };

      const getUnprocessedActionsOnFioChain = async () => {
        const offsetRange = parseInt(process.env.FIO_HISTORY_OFFSET);
        let offset = offsetRange;

        this.postMessage(
          logPrefix +
            `searching for blocks after blockNumber: ${lastProcessedBlockNumber}`,
        );

        let lowestBlockNumber;
        let actionsList = await getFioActionsLogs(offset);
        while (
          actionsList.length > 0 &&
          actionsList[0].block_num > lastProcessedBlockNumber &&
          (!lowestBlockNumber || lowestBlockNumber !== actionsList[0].block_num)
        ) {
          offset += offsetRange;
          lowestBlockNumber = actionsList[0].block_num;
          actionsList = await getFioActionsLogs(offset);
        }

        if (
          actionsList.length > 0 &&
          actionsList[actionsList.length - 1].block_num > lastProcessedBlockNumber
        )
          maxBlockNumber = actionsList[actionsList.length - 1].block_num;

        return actionsList.filter(
          elem =>
            elem.block_num > lastProcessedBlockNumber &&
            ((elem.action_trace.act.name === 'wraptokens' &&
              elem.action_trace.act.data.chain_code === 'ETH') ||
              (elem.action_trace.act.name === 'wrapdomain' &&
                elem.action_trace.act.data.chain_code === 'MATIC') ||
              elem.action_trace.act.name === 'unwraptokens' ||
              elem.action_trace.act.name === 'unwrapdomain'),
        );
      };

      const logs = await getUnprocessedActionsOnFioChain();

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

      if (maxBlockNumber && maxBlockNumber > lastProcessedBlockNumber)
        await WrapStatusBlockNumbers.setBlockNumber(maxBlockNumber, networkData.id, true);

      this.postMessage(logPrefix + 'successfully finished');
    } catch (e) {
      this.handleErrorMessage(e);
    }
  }

  async execute() {
    this.postMessage(
      `Starting... If there are a lot of unprocessed data, it may take some time to get it.`,
    );

    await this.executeActions([
      this.getPolygonLogs.bind(this, true),
      this.getPolygonLogs.bind(this, false),
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
