import { Op } from 'sequelize';
import { GenericAction } from '@fioprotocol/fiosdk';

import '../db';
import {
  OrderItem,
  BlockchainTransaction,
  FreeAddress,
  OrderItemStatus,
  Order,
  FioApiUrl,
  Var,
} from '../models/index.mjs';
import { fioApi } from '../external/fio.mjs';
import FioHistory from '../external/fio-history.mjs';
import CommonJob from './job.mjs';
import config from '../config/index.mjs';
import { searchTransactionInHistory, buildAccountsListForSearch } from '../utils/fio.mjs';
import { fetchWithRateLimit } from '../utils/general.mjs';

import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';
import { VARS_KEYS, ERROR_CODES } from '../config/constants.js';

import logger from '../logger.mjs';

const ORDER_SUCCESS_STATUS = Order.STATUS.SUCCESS;
const ORDER_PARTIALLY_SUCCESS_STATUS = Order.STATUS.PARTIALLY_SUCCESS;
const TX_SUCCESS_STATUS = BlockchainTransaction.STATUS.SUCCESS;

class RetryForkedTransactionsJob extends CommonJob {
  constructor() {
    super();
    this.fioHistory = null;
  }

  async initializeFioHistory() {
    // Get FIO History API URLs from database
    const fioHistoryUrls = await FioApiUrl.getApiUrls({
      type: FIO_API_URLS_TYPES.DASHBOARD_HISTORY_URL,
    });

    if (!fioHistoryUrls || fioHistoryUrls.length === 0) {
      throw new Error('No FIO History URLs configured in database');
    }

    this.postMessage(`Using FIO History URLs: ${fioHistoryUrls.join(', ')}`);
    this.fioHistory = new FioHistory({ fioHistoryUrls });
  }

  async checkFioNameExistsInChain(orderItem) {
    const { action, address, domain } = orderItem;

    try {
      const isAddress =
        action === GenericAction.registerFioAddress ||
        action === GenericAction.registerFioDomainAddress ||
        action === GenericAction.addBundledTransactions;

      const isDomain =
        action === GenericAction.registerFioDomain ||
        action === GenericAction.renewFioDomain;

      if (isAddress && address && domain) {
        const fioName = fioApi.setFioName(address, domain);
        const addressData = await fioApi.getFioAddress(fioName);
        return !!addressData;
      } else if (isDomain && domain) {
        const domainData = await fioApi.getFioDomain(domain);
        return !!domainData;
      }
    } catch (error) {
      if (error.code === ERROR_CODES.NOT_FOUND) {
        return false; // Name/domain doesn't exist in chain
      }
      // Re-throw unexpected errors
      throw error;
    }

    return false;
  }

  async findTransactionInHistory({ orderItem, blockchainTransaction }) {
    const {
      action,
      address,
      domain,
      publicKey,
      data,
      paymentProcessor,
      total,
    } = orderItem;
    const fioName = fioApi.setFioName(address, domain);

    const afterTimeForSearch = new Date(blockchainTransaction.createdAt).toISOString();

    const fioHistoryLimit = Number(await Var.getValByKey(VARS_KEYS.FIO_HISTORY_LIMIT));

    // Get accounts to search using the centralized utility with actual order data
    const accountsList = await buildAccountsListForSearch({
      publicKey,
      data,
      paymentProcessor,
      action,
      total,
    });

    // Use the utility function to search for the transaction
    const foundTransaction = await searchTransactionInHistory({
      fioHistory: this.fioHistory,
      action,
      fioName,
      domain,
      accountsList,
      searchParams: {
        limit: Number(fioHistoryLimit),
        simple: false,
        noBinary: true,
        sort: 'desc',
        after: afterTimeForSearch,
      },
      blockchainTransaction, // Pass the blockchain transaction for precise time window
    });

    return foundTransaction;
  }

  async findMissingTransactions() {
    const minMinutes = parseInt(config.cronJobs.retryForkedTransactionsMinMinutes) || 5;
    const maxMinutes = parseInt(config.cronJobs.retryForkedTransactionsMaxMinutes) || 10;

    // Calculate time range in UTC
    const now = Date.now();
    // minTime should be older (further back), maxTime should be newer (more recent)
    const minTime = new Date(now - maxMinutes * 60 * 1000).toISOString(); // older time (further back)
    const maxTime = new Date(now - minMinutes * 60 * 1000).toISOString(); // newer time (more recent)

    this.postMessage(`Checking transactions between ${minTime} and ${maxTime}`);

    // Query for successful orders with successful transaction status in the time range
    const [results] = await OrderItem.sequelize.query(
      `
      SELECT
        o.id as "orderId",
        o.number as "orderNumber",
        o."publicKey",
        o.total as "total",
        o."createdAt" as "orderCreatedAt",
        oi.id as "orderItemId",
        oi."action",
        oi.address as "address",
        oi.domain as "domain",
        oi.data,
        bt."txId" as "transactionId",
        bt."baseUrl",
        p.processor as "paymentProcessor"
      FROM orders o
      INNER JOIN "order-items" oi ON o.id = oi."orderId"
      INNER JOIN "order-items-status" ois ON oi.id = ois."orderItemId"
      INNER JOIN "blockchain-transactions" bt ON ois."blockchainTransactionId" = bt.id
      LEFT JOIN "payments" p on p."orderId" = o.id
      WHERE 
        (o.status = $1 OR o.status = $2)
        AND ois."txStatus" = $3
        AND bt."updatedAt" >= $4
        AND bt."updatedAt" <= $5
        AND bt."txId" IS NOT NULL
        AND bt."txId" != ''
        AND o."deletedAt" IS NULL
        AND oi."deletedAt" IS NULL
      ORDER BY o."createdAt" DESC
    `,
      {
        bind: [
          ORDER_SUCCESS_STATUS,
          ORDER_PARTIALLY_SUCCESS_STATUS,
          TX_SUCCESS_STATUS,
          minTime,
          maxTime,
        ],
      },
    );

    this.postMessage(`Found ${results.length} transactions to check`);

    if (results.length === 0) {
      return [];
    }

    const missingTransactions = [];
    const CHUNK_SIZE = 10; // Process transactions in smaller chunks to avoid rate limits

    // Split results into chunks for parallel processing
    const chunks = [];
    for (let i = 0; i < results.length; i += CHUNK_SIZE) {
      chunks.push(results.slice(i, i + CHUNK_SIZE));
    }

    this.postMessage(
      `Processing ${results.length} transactions in ${chunks.length} chunks of ${CHUNK_SIZE}`,
    );

    let checkedCount = 0;

    // Process each chunk
    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];

      this.postMessage(
        `Processing chunk ${chunkIndex + 1}/${chunks.length} (${
          chunk.length
        } transactions)`,
      );

      // Process all transactions in this chunk in parallel
      const chunkPromises = chunk.map(async row => {
        try {
          checkedCount++;
          const currentCount = checkedCount;

          // Check if transaction exists in FIO chain with proper multi-server logic
          const maxRetries =
            Number(await Var.getValByKey(VARS_KEYS.DEFAULT_MAX_RETRIES)) || 3;

          let transactionFound = false;
          let lastError = null;
          let serversChecked = 0;
          let executedFalseCount = 0;

          // Get all FIO history URLs to check manually
          const fioHistoryUrls = this.fioHistory.historyNodeUrls;

          for (const url of fioHistoryUrls) {
            try {
              serversChecked++;
              this.postMessage(
                `Checking transaction ${row.transactionId} on server ${serversChecked}/${fioHistoryUrls.length}: ${url}`,
              );

              const result = await fetchWithRateLimit({
                url: `${url}history/get_transaction?id=${row.transactionId}&block_hint=0`,
                maxRetries,
              });

              // If any server says executed: true, transaction exists - success!
              if (result && result.executed === true) {
                this.postMessage(
                  `✅ Transaction found ${currentCount}/${results.length}: ${row.transactionId} (executed: true on ${url})`,
                );
                transactionFound = true;
                break; // Found it, no need to check other servers
              } else if (result && result.executed === false) {
                executedFalseCount++;
                this.postMessage(
                  `⚠️ Transaction ${row.transactionId} has executed: false on server ${serversChecked}/${fioHistoryUrls.length}`,
                );
                // Continue to next server
              } else {
                // Unexpected response format
                this.postMessage(
                  `⚠️ Unexpected response format for transaction ${row.transactionId} from ${url}`,
                );
              }
            } catch (error) {
              lastError = error;
              this.postMessage(
                `❌ Error checking transaction ${row.transactionId} on server ${serversChecked}/${fioHistoryUrls.length}: ${error.message}`,
              );

              // If this is the last server and it failed, we'll treat as not executed
              if (serversChecked === fioHistoryUrls.length) {
                this.postMessage(
                  `⚠️ Last server failed for transaction ${row.transactionId}, treating as not executed`,
                );
              }
              // Continue to next server unless this was the last one
            }
          }

          if (transactionFound) {
            // At least one server confirmed executed: true
            return null; // Transaction found, not missing
          } else {
            // All servers said executed: false OR last server failed with error
            const reason =
              lastError && serversChecked === fioHistoryUrls.length
                ? `Last server failed: ${lastError.message}`
                : `All ${executedFalseCount} servers reported executed: false`;

            this.postMessage(
              `❌ Missing transaction ${currentCount}/${results.length}: ${row.transactionId} (${reason})`,
            );

            return {
              orderId: row.orderId,
              orderNumber: row.orderNumber,
              orderItemId: row.orderItemId,
              address: row.address,
              domain: row.domain,
              action: row.action,
              transactionId: row.transactionId,
              baseUrl: row.baseUrl,
              error: reason,
            };
          }
        } catch (error) {
          // If we get an error here, it means all servers failed or there are genuine issues
          // Don't treat as "missing transaction" to avoid incorrect resets
          this.postMessage(
            `⚠️ Skipping transaction ${row.transactionId} due to API infrastructure error: ${error.message}`,
          );

          logger.warn(
            `API infrastructure error checking transaction ${row.transactionId}, skipping to avoid incorrect reset:`,
            error,
          );

          return null; // Skip this transaction, don't treat as missing
        }
      });

      // Wait for all transactions in this chunk to complete
      const chunkResults = await Promise.all(chunkPromises);

      // Add missing transactions to the main array
      chunkResults.forEach(result => {
        if (result !== null) {
          missingTransactions.push(result);
        }
      });

      // Wait between chunks to avoid rate limiting
      if (chunkIndex < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    this.postMessage(
      `Check completed. Found ${missingTransactions.length} missing transactions out of ${results.length} checked.`,
    );

    return missingTransactions;
  }

  async resetOrderItems(missingTransactions) {
    if (missingTransactions.length === 0) {
      this.postMessage('No missing transactions to reset');
      return;
    }

    // Log for monitoring system to track specific affected orders
    missingTransactions.forEach(tx => {
      this.postMessage(
        `FORKED_TRANSACTIONS_DETECTED order=${tx.orderNumber} item=${fioApi.setFioName(
          tx.address,
          tx.domain,
        )} action=${tx.action} by ${tx.baseUrl}`,
      );
    });

    // Extract unique order IDs from missing transactions
    const orderIds = [...new Set(missingTransactions.map(tx => tx.orderId))];

    this.postMessage(`Resetting order items for order IDs: ${orderIds.join(', ')}`);

    const transaction = await OrderItem.sequelize.transaction();

    try {
      // Find all order-items from the specified order IDs
      const orderItems = await OrderItem.findAll({
        where: {
          orderId: {
            [Op.in]: orderIds,
          },
        },
        include: [
          {
            model: BlockchainTransaction,
            as: 'BlockchainTransactions',
            required: false,
          },
          {
            model: OrderItemStatus,
            as: 'OrderItemStatus',
            required: false,
          },
        ],
        transaction,
      });

      if (orderItems.length === 0) {
        this.postMessage('⚠️ No order items found for the specified order IDs');
        await transaction.rollback();
        return;
      }

      this.postMessage(`Found ${orderItems.length} order items to process`);

      // Separate order items based on whether they exist in the chain
      const itemsExistingInChain = [];
      const itemsNotExistingInChain = [];

      for (const orderItem of orderItems) {
        try {
          const existsInChain = await this.checkFioNameExistsInChain(orderItem);
          if (existsInChain) {
            itemsExistingInChain.push(orderItem);
            this.postMessage(
              `FIO name already exists in chain for order item ${orderItem.id}: ${orderItem.address}@${orderItem.domain}`,
            );
          } else {
            itemsNotExistingInChain.push(orderItem);
          }
        } catch (error) {
          logger.error(
            `Error checking FIO name existence for order item ${orderItem.id}:`,
            error,
          );
          // If we can't check, treat as not existing to be safe
          itemsNotExistingInChain.push(orderItem);
        }
      }

      this.postMessage(
        `${itemsExistingInChain.length} items exist in chain, ${itemsNotExistingInChain.length} items don't exist`,
      );

      // For items that exist in chain: handle renewFioDomain and addBundledTransactions specially
      if (itemsExistingInChain.length > 0) {
        const specialActionItems = [];
        const regularExistingItems = [];

        // Separate items that need special handling
        for (const item of itemsExistingInChain) {
          if (
            item.action === GenericAction.renewFioDomain ||
            item.action === GenericAction.addBundledTransactions
          ) {
            specialActionItems.push(item);
          } else {
            regularExistingItems.push(item);
          }
        }

        // Handle special actions (renewFioDomain, addBundledTransactions)
        const itemsToMarkAsSuccess = [];
        const itemsToFullyReset = [];

        for (const item of specialActionItems) {
          try {
            // Get the blockchain transaction for this item
            const blockchainTransaction =
              item.BlockchainTransactions && item.BlockchainTransactions[0];
            if (!blockchainTransaction) {
              this.postMessage(
                `No blockchain transaction found for order item ${item.id}, adding to full reset`,
              );
              itemsToFullyReset.push(item);
              continue;
            }

            this.postMessage(
              `Searching for transaction in history for order item ${item.id} (${item.action})`,
            );

            // Search for the transaction in FIO history
            const foundTransaction = await this.findTransactionInHistory({
              orderItem: item,
              blockchainTransaction,
            });

            if (foundTransaction) {
              const {
                block_num,
                timestamp,
                trx_id,
                act: { data: { max_fee: paramsMaxFee } = {} } = {},
              } = foundTransaction;

              this.postMessage(
                `Found transaction in history for order item ${item.id}: ${trx_id}`,
              );

              // Get the actual fee collected
              let max_fee = paramsMaxFee;
              const maxRetries =
                Number(await Var.getValByKey(VARS_KEYS.DEFAULT_MAX_RETRIES)) || 3;

              if (trx_id) {
                const transactionData = await this.fioHistory.getTransaction({
                  transactionId: trx_id,
                  maxRetries,
                });

                const feeCollectedAction =
                  transactionData &&
                  transactionData.actions &&
                  transactionData.actions.find(
                    ({ act }) => act.name === 'transfer' && act.data.from,
                  );

                if (feeCollectedAction && feeCollectedAction.act.data.amount) {
                  max_fee = fioApi.amountToSUF(feeCollectedAction.act.data.amount);
                }

                // Update blockchain transaction with found data
                await BlockchainTransaction.update(
                  {
                    status: BlockchainTransaction.STATUS.SUCCESS,
                    feeCollected: max_fee,
                    blockTime: timestamp ? timestamp + 'Z' : new Date(),
                    blockNum: block_num,
                    txId: trx_id,
                  },
                  {
                    where: { id: blockchainTransaction.id },
                    transaction,
                  },
                );

                // Update order item status
                const orderItemStatus = item.OrderItemStatus && item.OrderItemStatus[0];
                if (orderItemStatus) {
                  await OrderItemStatus.update(
                    {
                      txStatus: BlockchainTransaction.STATUS.SUCCESS,
                    },
                    {
                      where: { id: orderItemStatus.id },
                      transaction,
                    },
                  );
                }

                itemsToMarkAsSuccess.push(item);
                this.postMessage(
                  `Marked order item ${item.id} as successful with transaction ${trx_id}`,
                );
              }
            } else {
              this.postMessage(
                `Transaction not found in history for order item ${item.id}, adding to full reset`,
              );
              itemsToFullyReset.push(item);
            }
          } catch (error) {
            logger.error(
              `Error searching transaction history for order item ${item.id}:`,
              error,
            );
            this.postMessage(
              `Error searching for order item ${item.id}, adding to full reset`,
            );
            itemsToFullyReset.push(item);
          }
        }

        // Handle regular existing items (just clear txId)
        if (regularExistingItems.length > 0) {
          const regularItemIds = regularExistingItems.map(item => item.id);

          const updatedRegularTxCount = await BlockchainTransaction.update(
            { txId: null },
            {
              where: {
                orderItemId: {
                  [Op.in]: regularItemIds,
                },
              },
              transaction,
            },
          );

          this.postMessage(
            `Cleared txId for ${updatedRegularTxCount[0]} regular blockchain transactions (items exist in chain)`,
          );
        }

        // Add items that couldn't be found to the full reset list
        if (itemsToFullyReset.length > 0) {
          itemsNotExistingInChain.push(...itemsToFullyReset);
        }

        this.postMessage(
          `Special action results: ${itemsToMarkAsSuccess.length} marked as successful, ${itemsToFullyReset.length} added to full reset`,
        );
      }

      // For items that don't exist in chain: do full reset
      if (itemsNotExistingInChain.length > 0) {
        const nonExistingItemIds = itemsNotExistingInChain.map(item => item.id);

        // Update blockchain-transactions table to set txId to NULL
        const updatedTxCount = await BlockchainTransaction.update(
          { txId: null },
          {
            where: {
              orderItemId: {
                [Op.in]: nonExistingItemIds,
              },
            },
            transaction,
          },
        );

        this.postMessage(
          `Updated ${updatedTxCount[0]} blockchain transaction records (full reset)`,
        );

        // Process FIO handles and delete from free-addresses
        const fioHandlesToDelete = [];
        for (const orderItem of itemsNotExistingInChain) {
          const { address, domain } = orderItem;

          // Only process items with both address and domain (full FIO handles)
          if (address && domain) {
            const fioHandle = fioApi.setFioName(address, domain);
            fioHandlesToDelete.push(fioHandle);
          }
        }

        if (fioHandlesToDelete.length > 0) {
          const deletedFreeAddressCount = await FreeAddress.destroy({
            where: {
              name: {
                [Op.in]: fioHandlesToDelete,
              },
            },
            transaction,
          });

          this.postMessage(
            `Deleted ${deletedFreeAddressCount} records from free-addresses table`,
          );
        } else {
          this.postMessage('No full FIO handles found to delete from free-addresses');
        }

        // Update order-items-status to set txStatus to READY (only reset transaction status, keep payment status)
        const updatedStatusCount = await OrderItemStatus.update(
          { txStatus: BlockchainTransaction.STATUS.READY },
          {
            where: {
              orderItemId: {
                [Op.in]: nonExistingItemIds,
              },
            },
            transaction,
          },
        );

        this.postMessage(
          `Updated ${updatedStatusCount[0]} order item status records (full reset)`,
        );

        // Update blockchain-transactions status to 1
        const updatedBtStatusCount = await BlockchainTransaction.update(
          { status: BlockchainTransaction.STATUS.READY },
          {
            where: {
              orderItemId: {
                [Op.in]: nonExistingItemIds,
              },
            },
            transaction,
          },
        );

        this.postMessage(
          `Updated ${updatedBtStatusCount[0]} blockchain transaction status records (full reset)`,
        );
      }

      // Commit transaction
      await transaction.commit();

      this.postMessage('✅ Order items reset completed successfully!');
      this.postMessage(
        `Summary: ${orderItems.length} order items processed, ${itemsExistingInChain.length} items exist in chain (txId cleared only), ${itemsNotExistingInChain.length} items fully reset`,
      );
    } catch (error) {
      logger.error('Error during reset process:', error);
      await transaction.rollback();
      throw error;
    }
  }

  async execute() {
    try {
      this.postMessage('Starting retry forked transactions job...');

      // Initialize FIO History client
      await this.initializeFioHistory();

      // Find transactions that are missing from blockchain
      const missingTransactions = await this.findMissingTransactions();

      // Reset order items for missing transactions
      await this.resetOrderItems(missingTransactions);

      this.postMessage('Retry forked transactions job completed successfully');
    } catch (error) {
      logger.error('Error in retry forked transactions job:', error);
      this.postMessage(`Job failed: ${error.message}`);
      throw error;
    }

    this.finish();
  }
}

new RetryForkedTransactionsJob().execute();
