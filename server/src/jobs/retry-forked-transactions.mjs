import { Op } from 'sequelize';

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

import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';
import { VARS_KEYS } from '../config/constants.js';

import logger from '../logger.mjs';

const ORDER_SUCCESS_STATUS = Order.STATUS.SUCCESS;
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

  async findMissingTransactions() {
    const minMinutes = parseInt(config.cronJobs.retryForkedTransactionsMinMinutes) || 5;
    const maxMinutes = parseInt(config.cronJobs.retryForkedTransactionsMaxMinutes) || 10;

    // Calculate time range
    const maxTime = new Date(Date.now() - minMinutes * 60 * 1000);
    const minTime = new Date(Date.now() - maxMinutes * 60 * 1000);

    this.postMessage(
      `Checking transactions between ${minTime.toISOString()} and ${maxTime.toISOString()}`,
    );

    // Query for successful orders with successful transaction status in the time range
    const [results] = await OrderItem.sequelize.query(
      `
      SELECT DISTINCT
        o.id as "orderId",
        o.number as "orderNumber",
        o."createdAt" as "orderCreatedAt",
        oi.id as "orderItemId",
        oi.action as "orderItemAction",
        oi.address,
        oi.domain,
        bt."txId" as "transactionId",
        bt.id as "blockchainTransactionId",
        bt."createdAt" as "transactionCreatedAt"
      FROM orders o
      INNER JOIN "order-items" oi ON o.id = oi."orderId"
      INNER JOIN "order-items-status" ois ON oi.id = ois."orderItemId"
      INNER JOIN "blockchain-transactions" bt ON ois."blockchainTransactionId" = bt.id
      WHERE 
        o.status = $1
        AND ois."txStatus" = $2
        AND bt."createdAt" >= $3
        AND bt."createdAt" <= $4
        AND bt."txId" IS NOT NULL
        AND bt."txId" != ''
        AND o."deletedAt" IS NULL
        AND oi."deletedAt" IS NULL
      ORDER BY o."createdAt" DESC
    `,
      {
        bind: [ORDER_SUCCESS_STATUS, TX_SUCCESS_STATUS, minTime, maxTime],
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

          // Check if transaction exists in FIO chain
          const maxRetries =
            Number(await Var.getValByKey(VARS_KEYS.DEFAULT_MAX_RETRIES)) || 3;
          const fioHistoryResult = await this.fioHistory.getTransaction({
            transactionId: row.transactionId,
            maxRetries,
          });

          // If transaction doesn't exist or has error, it's missing
          if (!fioHistoryResult || !fioHistoryResult.executed) {
            this.postMessage(
              `❌ Missing transaction ${currentCount}/${results.length}: ${row.transactionId} (Order: ${row.orderNumber})`,
            );

            return {
              orderId: row.orderId,
              orderNumber: row.orderNumber,
              orderCreatedAt: row.orderCreatedAt,
              orderItemId: row.orderItemId,
              orderItemAction: row.orderItemAction,
              address: row.address,
              domain: row.domain,
              transactionId: row.transactionId,
              blockchainTransactionId: row.blockchainTransactionId,
              transactionCreatedAt: row.transactionCreatedAt,
              error:
                (fioHistoryResult && fioHistoryResult.error) ||
                'Transaction not found in chain',
            };
          } else {
            this.postMessage(
              `✅ Transaction found ${currentCount}/${results.length}: ${row.transactionId}`,
            );
            return null; // Transaction found, not missing
          }
        } catch (error) {
          this.postMessage(
            `Error checking transaction ${row.transactionId}: ${error.message}`,
          );

          return {
            orderId: row.orderId,
            orderNumber: row.orderNumber,
            orderCreatedAt: row.orderCreatedAt,
            orderItemId: row.orderItemId,
            orderItemAction: row.orderItemAction,
            address: row.address,
            domain: row.domain,
            transactionId: row.transactionId,
            blockchainTransactionId: row.blockchainTransactionId,
            transactionCreatedAt: row.transactionCreatedAt,
            error: error.message || 'Unknown error',
          };
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
        `FORKED_TRANSACTIONS_DETECTED orderId=${tx.orderId} orderItemId=${tx.orderItemId}`,
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

      this.postMessage(`Found ${orderItems.length} order items to reset`);

      const orderItemIds = orderItems.map(item => item.id);

      // Update blockchain-transactions table to set txId to NULL
      const updatedTxCount = await BlockchainTransaction.update(
        { txId: null },
        {
          where: {
            orderItemId: {
              [Op.in]: orderItemIds,
            },
          },
          transaction,
        },
      );

      this.postMessage(`Updated ${updatedTxCount[0]} blockchain transaction records`);

      // Process FIO handles and delete from free-addresses
      const fioHandlesToDelete = [];
      for (const orderItem of orderItems) {
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
              [Op.in]: orderItemIds,
            },
          },
          transaction,
        },
      );

      this.postMessage(`Updated ${updatedStatusCount[0]} order item status records`);

      // Update blockchain-transactions status to 1
      const updatedBtStatusCount = await BlockchainTransaction.update(
        { status: BlockchainTransaction.STATUS.READY },
        {
          where: {
            orderItemId: {
              [Op.in]: orderItemIds,
            },
          },
          transaction,
        },
      );

      this.postMessage(
        `Updated ${updatedBtStatusCount[0]} blockchain transaction status records`,
      );

      // Commit transaction
      await transaction.commit();

      this.postMessage('✅ Order items reset completed successfully!');
      this.postMessage(
        `Summary: ${orderItems.length} order items processed, ${updatedTxCount[0]} blockchain transactions updated, ${fioHandlesToDelete.length} free addresses deleted`,
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
