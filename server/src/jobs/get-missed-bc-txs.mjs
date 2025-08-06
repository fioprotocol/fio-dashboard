import '../db';

import { GenericAction } from '@fioprotocol/fiosdk';

import {
  OrderItem,
  OrderItemStatus,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  FioApiUrl,
} from '../models/index.mjs';
import { Var } from '../models/Var.mjs';
import CommonJob from './job.mjs';

import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';
import { VARS_KEYS } from '../config/constants';

import { fioApi } from '../external/fio.mjs';
import FioHistory from '../external/fio-history.mjs';
import { buildAccountsListForSearch } from '../utils/fio.mjs';

import logger from '../logger.mjs';

const loggerPrefix = 'BC TX';

/**
 * Check if transaction already exists in database
 */
async function isTransactionAlreadyClaimed(txId) {
  const existing = await BlockchainTransaction.findOne({
    where: { txId },
    attributes: ['id', 'orderItemId'],
    include: [
      {
        model: OrderItem,
        attributes: ['orderId'],
      },
    ],
  });
  return existing;
}

/**
 * Enhanced search function that returns multiple transactions and excludes already claimed ones
 */
async function searchMultipleTransactionsInHistory({
  fioHistory,
  action,
  fioName,
  domain,
  accountsList,
  currentOrderId,
  searchParams,
  excludeTxIds = [],
  loggerPrefix = '',
}) {
  const foundTransactions = [];

  try {
    const findMissedTxInAccountHistoryActions = async params => {
      try {
        const accountHistoryActions = await fioHistory.requestHistoryActions({
          params,
        });

        if (accountHistoryActions && accountHistoryActions.actions) {
          for (const txAction of accountHistoryActions.actions) {
            const { act, timestamp, block_num, trx_id } = txAction;

            // Skip if transaction is already claimed in current session
            if (excludeTxIds.includes(trx_id)) {
              if (loggerPrefix) {
                logger.info(
                  `${loggerPrefix} Skipping session-claimed transaction: ${trx_id}`,
                );
              }
              continue;
            }

            // Check database for existing transaction (lazy check)
            const existingTx = await isTransactionAlreadyClaimed(trx_id);
            if (existingTx) {
              const existingOrderId =
                existingTx.OrderItem && existingTx.OrderItem.orderId;

              if (
                existingOrderId &&
                existingOrderId.toString() !== currentOrderId.toString()
              ) {
                // ALERT: Transaction belongs to a different order - data integrity issue
                if (loggerPrefix) {
                  logger.error(
                    `${loggerPrefix} 🚨 DATA INTEGRITY ALERT: Transaction ${trx_id} already claimed by different order! Current: ${currentOrderId}, Existing: ${existingOrderId} (orderItem: ${existingTx.orderItemId})`,
                  );
                }
              } else {
                // Normal case: same order or no order info
                if (loggerPrefix) {
                  logger.info(
                    `${loggerPrefix} Skipping database-claimed transaction: ${trx_id} (orderItem: ${existingTx.orderItemId})`,
                  );
                }
              }
              continue;
            }

            // Check if this transaction matches our criteria
            const isMatch = (() => {
              switch (action) {
                case GenericAction.registerFioAddress:
                case GenericAction.registerFioDomainAddress:
                  return (
                    act.data &&
                    act.data.fio_address &&
                    act.data.fio_address.toLowerCase() === fioName.toLowerCase()
                  );
                case GenericAction.registerFioDomain:
                case GenericAction.renewFioDomain:
                  return (
                    act.data &&
                    act.data.fio_domain &&
                    act.data.fio_domain.toLowerCase() === domain.toLowerCase()
                  );
                case GenericAction.addBundledTransactions:
                  // For addBundledTransactions, match on fio_address
                  return (
                    act.data &&
                    act.data.fio_address &&
                    act.data.fio_address.toLowerCase() === fioName.toLowerCase()
                  );
                default:
                  return false;
              }
            })();

            if (isMatch) {
              foundTransactions.push({
                block_num,
                timestamp,
                trx_id,
                act,
              });
            }
          }
        }
      } catch (error) {
        if (loggerPrefix) {
          logger.warn(
            `${loggerPrefix} API error in findMissedTxInAccountHistoryActions for account ${params.account}: ${error.message}`,
          );
        }
      }
    };

    // Search through all accounts
    for (const account of accountsList) {
      if (!account) continue;

      if (loggerPrefix) {
        logger.info(`${loggerPrefix} Getting for account: ${account}`);
      }

      const accountSearchParams = {
        account,
        ...searchParams,
      };

      await findMissedTxInAccountHistoryActions(accountSearchParams);
    }

    // Sort by timestamp to get chronological order
    foundTransactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return foundTransactions;
  } catch (error) {
    logger.error(
      `${loggerPrefix} Critical error in searchMultipleTransactionsInHistory:`,
      error,
    );
    return [];
  }
}

class MissedTransactions extends CommonJob {
  async execute() {
    await fioApi.getRawAbi();

    // Add LIMIT to prevent processing too many orders at once
    const PROCESSING_LIMIT = 50; // Configurable limit

    const [orders] = await OrderItem.sequelize.query(
      `
      SELECT
        o.status,
        o.number,
        o."publicKey",
        o.id as "orderId",
        o."createdAt",
        oi.id as "orderItemId",
        oi."action",
        oi."address",
        oi."domain",
        oi.data,
        ois.id as "orderItemStatusId",
        bt.id as "blockchainTransactionId",
        bt."txId" as "txId",
        p.processor as "paymentProcessor"
      FROM "order-items" oi 
	    INNER JOIN orders o ON o.id = oi."orderId" 
	    LEFT JOIN "order-items-status" ois ON ois."orderItemId" = oi.id
      LEFT JOIN "blockchain-transactions" bt ON bt."orderItemId" = oi.id
      LEFT JOIN "payments" p on p."orderId" = o.id 
      WHERE o.status = 7 AND oi."deletedAt" IS NULL
        AND o."deletedAt" IS NULL 
        AND bt."deletedAt" IS NULL 
        AND (bt.id is NULL OR (bt."txId" IS NULL AND ois."blockchainTransactionId" = bt.id))
        AND p.processor != 'SYSTEM'
      ORDER by o."createdAt" DESC
      LIMIT $1
    `,
      {
        bind: [PROCESSING_LIMIT],
      },
    );

    logger.info(`${loggerPrefix} Found orders without bc txs: ${orders.length}`);

    const fioHistoryLimit = Number(await Var.getValByKey(VARS_KEYS.FIO_HISTORY_LIMIT));
    const maxRetries = Number(await Var.getValByKey(VARS_KEYS.DEFAULT_MAX_RETRIES));

    const fioHistoryUrls = await FioApiUrl.getApiUrls({
      type: FIO_API_URLS_TYPES.DASHBOARD_HISTORY_URL,
    });

    const fioHistory = new FioHistory({ fioHistoryUrls });

    // Group orders by orderId to handle multiple items in same order
    const orderGroups = orders.reduce((groups, order) => {
      const { orderId } = order;
      if (!groups[orderId]) {
        groups[orderId] = [];
      }
      groups[orderId].push(order);
      return groups;
    }, {});

    // Process orders in chunks to prevent memory issues and database load
    const CHUNK_SIZE = 5; // Process 5 orders at a time
    const CHUNK_DELAY_MS = 1000; // 1 second delay between chunks

    const orderEntries = Object.entries(orderGroups);
    logger.info(
      `${loggerPrefix} Processing ${orderEntries.length} orders in chunks of ${CHUNK_SIZE}`,
    );

    for (let i = 0; i < orderEntries.length; i += CHUNK_SIZE) {
      // Check if job has been cancelled
      if (this.isCancelled) {
        this.postMessage('Job cancelled during processing');
        return false;
      }

      const chunk = orderEntries.slice(i, i + CHUNK_SIZE);
      const chunkNumber = Math.floor(i / CHUNK_SIZE) + 1;
      const totalChunks = Math.ceil(orderEntries.length / CHUNK_SIZE);

      logger.info(
        `${loggerPrefix} Processing chunk ${chunkNumber}/${totalChunks} (${chunk.length} orders)`,
      );

      // Process orders in chunk sequentially to avoid overwhelming the API
      for (const [orderId, orderItems] of chunk) {
        logger.info(
          `${loggerPrefix} Processing order: ${orderId} with ${orderItems.length} items`,
        );

        // Track claimed transaction IDs per order (this was the original issue)
        const orderClaimedTxIds = new Set();

        // Sort order items by creation time to maintain order
        orderItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        for (const order of orderItems) {
          const {
            action,
            address,
            createdAt,
            data,
            domain,
            publicKey,
            blockchainTransactionId,
            orderItemId,
            orderItemStatusId,
            paymentProcessor,
            total,
          } = order;

          logger.info(`${loggerPrefix} Order: ${orderId}, orderItemId: ${orderItemId}`);

          const fioName = fioApi.setFioName(address, domain);

          // Get accounts to search using the centralized utility
          const accountsList = await buildAccountsListForSearch({
            publicKey,
            data,
            paymentProcessor,
            action,
            total,
          });

          const afterTimeForSearch = new Date(createdAt).toISOString();

          try {
            // Search for multiple transactions, checking claims lazily
            const foundTransactions = await searchMultipleTransactionsInHistory({
              fioHistory,
              action,
              fioName,
              domain: domain,
              accountsList,
              currentOrderId: orderId, // Pass current order ID for cross-order validation
              searchParams: {
                limit: Math.min(Number(fioHistoryLimit) * 2, 1000), // Increase limit but respect API maximum
                simple: false,
                noBinary: true,
                sort: 'desc',
                after: afterTimeForSearch,
              },
              excludeTxIds: Array.from(orderClaimedTxIds), // Only order-scoped claimed transactions
              loggerPrefix,
            });

            if (foundTransactions.length === 0) {
              logger.error(
                `${loggerPrefix} Update: no unclaimed transactions found for order: ${orderId}, order item id ${orderItemId}`,
              );
              continue;
            }

            // Take the first unclaimed transaction
            const addressTransactionHistory = foundTransactions[0];
            const {
              block_num,
              timestamp,
              trx_id,
              act: { data: { max_fee: paramsMaxFee } = {} } = {},
            } = addressTransactionHistory;

            // Mark this transaction as claimed for this order
            orderClaimedTxIds.add(trx_id);

            const foundActor = accountsList[0];
            logger.info(`${loggerPrefix} Found Actor: ${foundActor}`);
            logger.info(
              `${loggerPrefix} Claiming transaction: ${trx_id} for order item: ${orderItemId}`,
            );

            let max_fee = paramsMaxFee;

            if (trx_id) {
              const transactionData = await fioHistory.getTransaction({
                transactionId: trx_id,
                maxRetries,
              });

              const feeCollectedAction =
                transactionData &&
                transactionData.actions &&
                transactionData.actions.find(
                  ({ act }) => act.name === 'transfer' && act.data.from === foundActor,
                );

              if (feeCollectedAction && feeCollectedAction.act.data.amount) {
                max_fee = fioApi.amountToSUF(feeCollectedAction.act.data.amount);
              }

              await BlockchainTransaction.sequelize.transaction(async t => {
                const bcTxExists = await BlockchainTransaction.findOne({
                  where: { txId: trx_id },
                  transaction: t,
                });

                if (!bcTxExists) {
                  if (blockchainTransactionId) {
                    await BlockchainTransaction.update(
                      {
                        status: BlockchainTransaction.STATUS.SUCCESS,
                        feeCollected: max_fee,
                        blockTime: timestamp ? timestamp + 'Z' : new Date(),
                        blockNum: block_num,
                        txId: trx_id,
                      },
                      {
                        where: {
                          id: blockchainTransactionId,
                        },
                        transaction: t,
                      },
                    );
                    await OrderItemStatus.update(
                      {
                        txStatus: BlockchainTransaction.STATUS.SUCCESS,
                      },
                      {
                        where: {
                          id: orderItemStatusId,
                        },
                        transaction: t,
                      },
                    );
                  } else {
                    const bcTx = await BlockchainTransaction.create(
                      {
                        status: BlockchainTransaction.STATUS.SUCCESS,
                        feeCollected: max_fee,
                        blockTime: timestamp ? timestamp + 'Z' : new Date(),
                        blockNum: block_num,
                        txId: trx_id,
                        action,
                        orderItemId,
                      },
                      {
                        transaction: t,
                      },
                    );

                    await BlockchainTransactionEventLog.create(
                      {
                        status: BlockchainTransaction.STATUS.SUCCESS,
                        blockchainTransactionId: bcTx.id,
                      },
                      { transaction: t },
                    );

                    await OrderItemStatus.update(
                      {
                        txStatus: BlockchainTransaction.STATUS.SUCCESS,
                        blockchainTransactionId: bcTx.id,
                      },
                      {
                        where: {
                          id: orderItemStatusId,
                        },
                        transaction: t,
                      },
                    );
                  }
                  logger.info(
                    `${loggerPrefix} Updated: order id - ${orderId}, orderItemId - ${orderItemId}, blockchainTransactionId - ${blockchainTransactionId}, tx - ${trx_id}`,
                  );
                } else {
                  logger.error(
                    `${loggerPrefix} Transaction ${trx_id} already exists for orderItemId: ${bcTxExists.orderItemId}, skipping this transaction`,
                  );

                  // Remove from order claimed set - this shouldn't happen with our new logic but safety check
                  orderClaimedTxIds.delete(trx_id);
                }
              });
            }
          } catch (e) {
            logger.error(
              `${loggerPrefix} Update Error: order id - ${orderId}, orderItemId - ${orderItemId}, blockchainTransactionId: ${blockchainTransactionId}`,
              e,
            );
          }
        }
      }

      // Add delay between chunks to prevent API rate limiting (except for the last chunk)
      if (i + CHUNK_SIZE < orderEntries.length) {
        logger.info(`${loggerPrefix} Waiting ${CHUNK_DELAY_MS}ms before next chunk...`);
        await new Promise(resolve => setTimeout(resolve, CHUNK_DELAY_MS));
      }
    }

    logger.info(`${loggerPrefix} All order groups processed successfully`);
    this.finish();
  }
}

new MissedTransactions().execute();
