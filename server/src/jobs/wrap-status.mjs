import fs from 'fs';

import Web3 from 'web3';
import superagent from 'superagent';

import '../db';

import CommonJob from './job.mjs';
import {
  WrapStatusBlockNumbers,
  WrapStatusEthUnwrapLogs,
  WrapStatusEthWrapLogs,
  WrapStatusFioUnwrapNftsLogs,
  WrapStatusFioUnwrapTokensLogs,
  WrapStatusFioWrapNftsLogs,
  WrapStatusFioWrapTokensLogs,
  WrapStatusNetworks,
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

class WrapStatusJob extends CommonJob {
  constructor() {
    super();
  }

  handleErrorMessage(message) {
    // eslint-disable-next-line no-console
    console.log(message);
  }

  async getPolygonLogs(isWrap = false) {
    const logPrefix = `Get POLYGON Logs, isWrap: ${isWrap} --> `;

    try {
      const web3 = new Web3(process.env.POLYGON_INFURA);
      const blocksRangeLimit = parseInt(process.env.BLOCKS_RANGE_LIMIT_POLY);

      const fioNftContractOnPolygonChain = new web3.eth.Contract(
        WRAPPED_DOMAIN_ABI,
        process.env.FIO_NFT_POLYGON_CONTRACT,
      );

      const getPolygonActionsLogs = async (from, to) => {
        return await fioNftContractOnPolygonChain.getPastEvents(
          isWrap ? 'wrapped' : 'unwrapped',
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
        const networkData = await WrapStatusNetworks.findOneWhere({
          id: WRAP_STATUS_NETWORKS_IDS.POLYGON,
        });
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
        this.postMessage(logPrefix + 'finish at blockNumber', lastInChainBlockNumber);

        let fromBlockNumber = lastProcessedBlockNumber + 1;

        let result = [];
        let maxCheckedBlockNumber = 0;

        // todo: check if possible to rewrite onto Promise.all async bunches process. Possible difficulties: 1) large amount of parallel request (server limitations, and Infura Api limitations); 2) configuring limitation value. Profit: much faster job's work for big ranges.
        while (fromBlockNumber <= lastInChainBlockNumber) {
          const maxAllowedBlockNumber = fromBlockNumber + blocksRangeLimit - 1;
          const toBlockNumber =
            maxAllowedBlockNumber > lastInChainBlockNumber
              ? lastInChainBlockNumber
              : maxAllowedBlockNumber;

          maxCheckedBlockNumber = toBlockNumber;

          result = [
            ...result,
            ...(await getPolygonActionsLogs(fromBlockNumber, toBlockNumber)),
          ];

          fromBlockNumber = toBlockNumber + 1;
        }

        await WrapStatusBlockNumbers.setBlockNumber(
          maxCheckedBlockNumber,
          networkData.id,
          isWrap,
        );

        this.postMessage(logPrefix + `result length ${result.length}`);
        return result;
      };

      const data = await getUnprocessedActionsLogs();

      if (data.length > 0) {
        if (isWrap) {
          await WrapStatusPolygonWrapLogs.bulkCreate(
            data.map(log => ({
              transactionHash: log.transactionHash,
              obtId: log.returnValues.obtid,
              data: { ...log },
            })),
          );
        } else
          await WrapStatusPolygonUnwrapLogs.bulkCreate(
            data.map(log => ({
              transactionHash: log.transactionHash,
              address: log.address,
              blockNumber: log.blockNumber,
              domain: log.returnValues.domain,
              fioAddress: log.returnValues.fioaddress,
              data: { ...log },
            })),
          );
      }

      this.postMessage(logPrefix + 'successfully finished');
      return data.length;
    } catch (e) {
      this.handleErrorMessage(e);
    }
  }

  async getEthLogs(isWrap = false) {
    const logPrefix = `Get ETH Logs, isWrap: ${isWrap} --> `;
    try {
      const web3 = new Web3(process.env.ETH_INFURA);
      const blocksRangeLimit = parseInt(process.env.BLOCKS_RANGE_LIMIT_ETH);

      const fioTokenContractOnEthChain = new web3.eth.Contract(
        WRAPPED_TOKEN_ABI,
        process.env.FIO_TOKEN_ETH_CONTRACT,
      );

      const getEthActionsLogs = async (from, to) => {
        return await fioTokenContractOnEthChain.getPastEvents(
          isWrap ? 'wrapped' : 'unwrapped',
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
        const networkData = await WrapStatusNetworks.findOneWhere({
          id: WRAP_STATUS_NETWORKS_IDS.ETH,
        });
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
        this.postMessage(logPrefix + 'finish at blockNumber', lastInChainBlockNumber);

        let fromBlockNumber = lastProcessedBlockNumber + 1;

        let result = [];
        let maxCheckedBlockNumber = 0;

        while (fromBlockNumber <= lastInChainBlockNumber) {
          const maxAllowedBlockNumber = fromBlockNumber + blocksRangeLimit - 1;
          const toBlockNumber =
            maxAllowedBlockNumber > lastInChainBlockNumber
              ? lastInChainBlockNumber
              : maxAllowedBlockNumber;

          maxCheckedBlockNumber = toBlockNumber;

          result = [
            ...result,
            ...(await getEthActionsLogs(fromBlockNumber, toBlockNumber)),
          ];

          fromBlockNumber = toBlockNumber + 1;
        }

        await WrapStatusBlockNumbers.setBlockNumber(
          maxCheckedBlockNumber,
          networkData.id,
          isWrap,
        );

        this.postMessage(logPrefix + `result length ${result.length}`);
        return result;
      };

      const data = await getUnprocessedActionsLogs();

      if (data.length > 0) {
        if (isWrap) {
          await WrapStatusEthWrapLogs.bulkCreate(
            data.map(log => ({
              transactionHash: log.transactionHash,
              obtId: log.returnValues.obtid,
              data: { ...log },
            })),
          );
        } else
          await WrapStatusEthUnwrapLogs.bulkCreate(
            data.map(log => ({
              transactionHash: log.transactionHash,
              address: log.address,
              blockNumber: log.blockNumber,
              amount: log.returnValues.amount,
              fioAddress: log.returnValues.fioaddress,
              data: { ...log },
            })),
          );
      }

      this.postMessage(logPrefix + 'successfully finished');
      return data.length;
    } catch (e) {
      this.handleErrorMessage(e);
    }
  }

  async getUnwrapFioLogs() {
    const logPrefix = `Get FIO Logs, Unwrap --> `;
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

      const getUnprocessedOracleVotes = async () => {
        const startPosition =
          ((await WrapStatusFioUnwrapTokensLogs.count()) || 0) +
          ((await WrapStatusFioUnwrapNftsLogs.count()) || 0);

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

      const result = await getUnprocessedOracleVotes();

      const unwrapNfts = [];
      const unwrapTokens = [];

      result.forEach(logItem => {
        if (logItem.nftname && logItem.nftname.length > 1) {
          unwrapNfts.push(logItem);
        } else unwrapTokens.push(logItem);
      });

      this.postMessage(logPrefix + `unwrapTokens result length: ${unwrapTokens.length}`);
      this.postMessage(logPrefix + `unwrapNfts result length: ${unwrapNfts.length}`);

      if (unwrapNfts.length > 0)
        await WrapStatusFioUnwrapNftsLogs.bulkCreate(
          unwrapNfts.map(log => ({
            obtId: log.obt_id,
            isComplete: !!log.isComplete,
            data: { ...log },
          })),
        );

      if (unwrapTokens.length > 0)
        await WrapStatusFioUnwrapTokensLogs.bulkCreate(
          unwrapTokens.map(log => ({
            obtId: log.obt_id,
            isComplete: !!log.isComplete,
            data: { ...log },
          })),
        );

      this.postMessage(logPrefix + 'successfully finished');
    } catch (e) {
      this.handleErrorMessage(e);
    }
  }

  async getWrapFioLogs() {
    const logPrefix = `Get FIO Logs, Wrap --> `;
    try {
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
        const networkData = await WrapStatusNetworks.findOneWhere({
          id: WRAP_STATUS_NETWORKS_IDS.FIO,
        });
        const lastProcessedBlockNumber = await WrapStatusBlockNumbers.getBlockNumber(
          networkData.id,
          true,
        );
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
          await WrapStatusBlockNumbers.setBlockNumber(
            actionsList[actionsList.length - 1].block_num,
            networkData.id,
            true,
          );

        return actionsList.filter(
          elem =>
            elem.block_num > lastProcessedBlockNumber &&
            ((elem.action_trace.act.name === 'wraptokens' &&
              elem.action_trace.act.data.chain_code === 'ETH') ||
              (elem.action_trace.act.name === 'wrapdomain' &&
                elem.action_trace.act.data.chain_code === 'MATIC')),
        );
      };

      const logs = await getUnprocessedActionsOnFioChain();

      const wrapDomainLogs = [];
      const wrapTokensLogs = [];

      logs.forEach(logItem => {
        if (logItem.action_trace.act.name === 'wraptokens') {
          wrapTokensLogs.push(logItem);
        } else wrapDomainLogs.push(logItem);
      });

      this.postMessage(logPrefix + `wrapTokens result length: ${wrapTokensLogs.length}`);
      this.postMessage(logPrefix + `wrapDomains result length: ${wrapDomainLogs.length}`);

      if (wrapDomainLogs.length > 0)
        await WrapStatusFioWrapNftsLogs.bulkCreate(
          wrapDomainLogs.map(log => ({
            transactionId: log.action_trace.trx_id,
            address: log.action_trace.act.data.public_address,
            domain: log.action_trace.act.data.fio_domain,
            blockNumber: log.block_num,
            data: { ...log },
          })),
        );

      if (wrapTokensLogs.length > 0)
        await WrapStatusFioWrapTokensLogs.bulkCreate(
          wrapTokensLogs.map(log => ({
            transactionId: log.action_trace.trx_id,
            address: log.action_trace.act.data.public_address,
            amount: log.action_trace.act.data.amount,
            blockNumber: log.block_num,
            data: { ...log },
          })),
        );

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
      this.getUnwrapFioLogs.bind(this),
      this.getWrapFioLogs.bind(this),
    ]);

    this.finish();
  }
}

new WrapStatusJob().execute();
