// server/services/EvmChainProcessor.mjs
/**
 * Generic EVM chain event processor
 */
import Web3 from 'web3';

import { CHAINS_CONFIG, ACTION_TYPE, EVM_EVENT_NAME } from '../../config/chains.mjs';
import { WrapStatusEvmChainEvents } from '../../models/WrapStatusEvmChainEvents.mjs';
import { WrapStatusBlockNumbers } from '../../models/WrapStatusBlockNumbers.mjs';

import logger from '../../logger.mjs';

export class EvmChainProcessor {
  constructor(networkName, rateLimiter) {
    this.config = CHAINS_CONFIG[networkName];
    if (!this.config) {
      throw new Error(`Chain configuration not found for ${networkName}`);
    }

    this.networkName = networkName;
    this.rateLimiter = rateLimiter;
    this.web3 = new Web3(this.config.rpcUrl());
    this.contract = new this.web3.eth.Contract(
      this.config.contract.abi,
      this.config.contract.address,
    );
  }

  async getLastProcessedBlock() {
    const lastBlock = await WrapStatusBlockNumbers.getBlockNumber({
      networkId: this.config.id,
    });
    // Use firstBlockNumber from config if no block has been processed yet
    return lastBlock || this.config.firstBlockNumber || 0;
  }

  async updateLastProcessedBlock(blockNumber) {
    await WrapStatusBlockNumbers.setBlockNumber({
      value: blockNumber,
      networkId: this.config.id,
    });
  }

  async fetchAllEvents(fromBlock, toBlock) {
    return await this.rateLimiter.executeWithRetry(async () => {
      return await this.contract.getPastEvents('allEvents', {
        fromBlock,
        toBlock,
      });
    }, `${this.networkName} allEvents blocks ${fromBlock}-${toBlock}`);
  }

  async getBatchBlockTimestamps(blockNumbers) {
    if (!blockNumbers || blockNumbers.length === 0) {
      return {};
    }

    const uniqueBlocks = [...new Set(blockNumbers)];
    const batch = new this.web3.BatchRequest();

    const promises = uniqueBlocks.map(blockNumber => {
      return new Promise(resolve => {
        batch.add(
          this.web3.eth.getBlock.request(blockNumber, (error, block) => {
            if (error) {
              logger.error(
                `[${this.networkName}] Error fetching block ${blockNumber}:`,
                error.message,
              );
              resolve({ number: blockNumber, timestamp: null });
            } else if (!block) {
              logger.warn(`[${this.networkName}] Block ${blockNumber} returned null`);
              resolve({ number: blockNumber, timestamp: null });
            } else {
              // Safely convert timestamp to string
              let timestamp = null;
              try {
                if (block.timestamp !== undefined && block.timestamp !== null) {
                  timestamp = String(block.timestamp);
                }
              } catch (err) {
                logger.error(
                  `[${this.networkName}] Error converting timestamp for block ${blockNumber}:`,
                  err.message,
                );
              }

              resolve({
                number: blockNumber,
                timestamp: timestamp,
              });
            }
          }),
        );
      });
    });

    batch.execute();
    const blocks = await Promise.all(promises);

    // Create a map of block numbers to timestamps, filtering out nulls
    return blocks.reduce((acc, block) => {
      if (block && block.timestamp !== null) {
        acc[block.number] = block.timestamp;
      }
      return acc;
    }, {});
  }

  async getTokenIdFromBurnTx(txHash) {
    if (this.config.assetType !== 'nft') return null;

    try {
      const tx = await this.rateLimiter.executeWithRetry(
        () => this.web3.eth.getTransaction(txHash),
        `get tx ${txHash}`,
      );

      const methodId = tx.input.slice(0, 10);
      const burnMethodId = this.web3.utils
        .keccak256('burnnft(uint256,string)')
        .slice(0, 10);

      if (methodId === burnMethodId) {
        const decodedParams = this.web3.eth.abi.decodeParameters(
          ['uint256', 'string'],
          tx.input.slice(10),
        );
        return decodedParams[0];
      }
      return null;
    } catch (error) {
      logger.error(
        `[${this.networkName}] Error getting tokenId from tx ${txHash}:`,
        error.message,
      );
      return null;
    }
  }

  /**
   * Map event name to action type
   */
  getEventType(eventName) {
    switch (eventName) {
      case EVM_EVENT_NAME.WRAP:
        return ACTION_TYPE.WRAP;
      case EVM_EVENT_NAME.UNWRAP:
        return ACTION_TYPE.UNWRAP;
      case EVM_EVENT_NAME.BURN:
        return ACTION_TYPE.BURN;
      case EVM_EVENT_NAME.ORACLE_CONFIRMATION:
        return 'oracle_confirmation';
      default:
        return null;
    }
  }

  async transformEvent(event, eventType, blockTimestamps) {
    const blockTimestamp = blockTimestamps[event.blockNumber];

    if (blockTimestamp === undefined || blockTimestamp === null) {
      logger.error(
        `[${this.networkName}] Missing timestamp for block ${event.blockNumber}, tx: ${event.transactionHash}, event: ${event.event}`,
      );
      return null;
    }

    const baseEvent = {
      network_id: this.config.id,
      event_type: eventType,
      block_number: event.blockNumber,
      block_timestamp: blockTimestamp,
      transaction_hash: event.transactionHash,
      event_data: {
        returnValues: event.returnValues,
        logIndex: event.logIndex,
        transactionIndex: event.transactionIndex,
        address: event.address,
      },
    };

    // Add tokenId for burn events on NFT chains
    if (eventType === ACTION_TYPE.BURN && this.config.assetType === 'nft') {
      const tokenId = await this.getTokenIdFromBurnTx(event.transactionHash);
      if (tokenId) {
        baseEvent.event_data.tokenId = tokenId;
      }
    }

    return baseEvent;
  }

  async processChain() {
    const lastProcessedBlock = await this.getLastProcessedBlock();
    const currentBlock = await this.rateLimiter.executeWithRetry(
      () => this.web3.eth.getBlockNumber(),
      `${this.networkName} get block number`,
    );

    logger.info(
      `[${this.networkName}] Processing from block ${lastProcessedBlock} to ${currentBlock}`,
    );

    if (lastProcessedBlock >= currentBlock) {
      logger.info(`[${this.networkName}] Already up to date`);
      return 0;
    }

    const blocksRangeLimit = this.config.blocksRangeLimit;
    let processedCount = 0;

    for (
      let fromBlock = lastProcessedBlock + 1;
      fromBlock <= currentBlock;
      fromBlock += blocksRangeLimit
    ) {
      const toBlock = Math.min(fromBlock + blocksRangeLimit - 1, currentBlock);

      try {
        // Fetch ALL events in one call for this block range
        logger.info(
          `[${this.networkName}] Fetching all events from ${fromBlock} to ${toBlock}`,
        );

        const allEvents = await this.fetchAllEvents(fromBlock, toBlock);

        if (allEvents.length === 0) {
          // No events in this range, update block number and continue
          await this.updateLastProcessedBlock(toBlock);
          logger.info(
            `[${this.networkName}] No events found in blocks ${fromBlock}-${toBlock}`,
          );
          continue;
        }

        logger.info(
          `[${this.networkName}] Found ${allEvents.length} events in blocks ${fromBlock}-${toBlock}`,
        );

        // Get unique block numbers and fetch timestamps once
        const blockNumbers = [...new Set(allEvents.map(e => e.blockNumber))];
        const blockTimestamps = await this.getBatchBlockTimestamps(blockNumbers);

        // Filter and transform events
        const transformedEvents = [];
        const eventCounts = {
          wrap: 0,
          unwrap: 0,
          burn: 0,
          oracle_confirmation: 0,
          unknown: 0,
        };

        for (const event of allEvents) {
          // Get event type based on event name
          const eventType = this.getEventType(event.event);

          if (!eventType) {
            eventCounts.unknown++;
            logger.warn(
              `[${this.networkName}] Unknown event type: ${event.event} in tx ${event.transactionHash}`,
            );
            continue;
          }

          // Transform the event
          const transformedEvent = await this.transformEvent(
            event,
            eventType,
            blockTimestamps,
          );

          if (transformedEvent) {
            transformedEvents.push(transformedEvent);
            eventCounts[eventType]++;
          }
        }

        // Save all transformed events
        if (transformedEvents.length > 0) {
          await WrapStatusEvmChainEvents.addEvents(transformedEvents);
          processedCount += transformedEvents.length;

          logger.info(
            `[${this.networkName}] Saved ${transformedEvents.length} events (blocks ${fromBlock}-${toBlock}): ` +
              `${eventCounts.wrap} wraps, ` +
              `${eventCounts.unwrap} unwraps, ` +
              `${eventCounts.burn} burns, ` +
              `${eventCounts.oracle_confirmation} oracle confirmations` +
              (eventCounts.unknown > 0 ? `, ${eventCounts.unknown} unknown` : ''),
          );
        }

        await this.updateLastProcessedBlock(toBlock);
      } catch (error) {
        logger.error(
          `[${this.networkName}] Error processing blocks ${fromBlock}-${toBlock}: ${error.message}`,
        );
        throw error;
      }
    }

    logger.info(
      `[${this.networkName}] Completed. Total events processed: ${processedCount}`,
    );
    return processedCount;
  }
}
