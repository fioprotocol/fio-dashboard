import '../db';
import { GenericAction } from '@fioprotocol/fiosdk';

import {
  OrderItemStatus,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  LockedFch,
  FioApiUrl,
  Var,
  Payment,
} from '../models/index.mjs';
import CommonJob from './job.mjs';

import { updateOrderStatus } from '../services/updateOrderStatus.mjs';

import { fioApi } from '../external/fio.mjs';
import FioHistory from '../external/fio-history.mjs';

import { FIO_ADDRESS_DELIMITER, ERROR_CODES, VARS_KEYS } from '../config/constants.js';
import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';

import { normalizeFioHandle } from '../utils/fio.mjs';

import logger from '../logger.mjs';
import { updateFioPaymentWithActualTotal } from '../utils/payment.mjs';

const MAX_CHECK_TIMES = 10;

class TxCheckJob extends CommonJob {
  async isTxExpired({ txId, itemId }) {
    const maxRetries = Number(await Var.getValByKey(VARS_KEYS.DEFAULT_MAX_RETRIES));

    try {
      const fioHistoryUrls = await FioApiUrl.getApiUrls({
        type: FIO_API_URLS_TYPES.DASHBOARD_HISTORY_URL,
      });

      logger.info('fioHistoryUrls', fioHistoryUrls);

      const res = await new FioHistory({
        fioHistoryUrls,
      }).getTransaction({ transactionId: txId, maxRetries });

      logger.info(`TX ${txId} - ITEM ID ${itemId} EXECUTED: ${res && res.executed}`);

      const txRegexpString = `Transaction ${txId} not found`;
      const txRegexp = new RegExp(txRegexpString, 'i');

      if (
        res.code &&
        res.code === ERROR_CODES.RANGE_NOT_SATISFIABLE &&
        res.error &&
        res.error.details &&
        res.error.details.find(details => !!details.message.match(txRegexp))
      ) {
        return BlockchainTransaction.STATUS.EXPIRE;
      }

      return null;
    } catch (error) {
      logger.error(`TX ITEM GET HISTORY ERROR ${itemId} - txId: ${txId}`, error);
    }
  }
  async execute() {
    await fioApi.getRawAbi();

    // get transactions need to check if existsx
    const [items] = await BlockchainTransaction.checkIrreversibility();

    const bcTxOrderItems = items.reduce((acc, item) => {
      if (!acc[item.orderId]) acc[item.orderId] = [];
      acc[item.orderId].push(item);

      return acc;
    }, {});

    const processTxItem = item => async () => {
      if (this.isCancelled)
        return { success: false, itemId: item.id, reason: 'cancelled' };

      const {
        id,
        address: itemAddress,
        domain: itemDomain,
        action,
        btData = {},
        btId,
        params,
        publicKey,
        txId,
        baseUrl,
        orderId,
      } = item;
      this.postMessage(`Processing tx item id - ${id}`);

      const address = normalizeFioHandle(itemAddress);
      const domain = normalizeFioHandle(itemDomain);

      try {
        let status = BlockchainTransaction.STATUS.PENDING;

        switch (action) {
          case GenericAction.renewFioDomain:
          case GenericAction.addBundledTransactions: {
            status = await this.isTxExpired({
              txId,
              itemId: item ? item.id : null,
            });

            if (!btData.checkIteration) btData.checkIteration = 0;
            ++btData.checkIteration;

            if (status !== BlockchainTransaction.STATUS.EXPIRE) {
              status = BlockchainTransaction.STATUS.SUCCESS;
            }

            if (
              btData.checkIteration > MAX_CHECK_TIMES &&
              status !== BlockchainTransaction.STATUS.SUCCESS
            )
              status = BlockchainTransaction.STATUS.FAILED;

            break;
          }
          case GenericAction.registerFioDomainAddress:
          case GenericAction.registerFioAddress:
          case GenericAction.registerFioDomain: {
            const isAddress =
              action === GenericAction.registerFioAddress ||
              action === GenericAction.registerFioDomainAddress;
            const fioName = isAddress
              ? `${address}${FIO_ADDRESS_DELIMITER}${domain}`
              : domain;

            let found;
            let checkRes;
            try {
              let ownerAccount;

              logger.info(`TX ITEM PROCESSING - BASE URL: ${baseUrl}`);

              if (isAddress) {
                checkRes = await fioApi.getFioAddress(fioName);
                ownerAccount = checkRes && checkRes.owner_account;
              } else {
                checkRes = await fioApi.getFioDomain(fioName);
                ownerAccount = checkRes && checkRes.account;
              }

              const { accountnm } = fioApi.accountHash(
                (params && params.owner_fio_public_key) || publicKey,
              );

              logger.info(`TX ITEM PROCESSING - OWNER ACCOUNT: ${ownerAccount}`);
              logger.info(`TX ITEM PROCESSING - ACCOUNTNM: ${accountnm}`);

              if (accountnm === ownerAccount) {
                found = true;
              }
            } catch (error) {
              if (error.code !== ERROR_CODES.NOT_FOUND) {
                throw error;
              }
            }

            logger.info(`TX ITEM PROCESSING - FOUND: ${found}`);

            if (found) status = BlockchainTransaction.STATUS.SUCCESS;

            if (!btData.checkIteration) btData.checkIteration = 0;
            ++btData.checkIteration;

            if (!found && status !== BlockchainTransaction.STATUS.SUCCESS) {
              status = await this.isTxExpired({
                txId,
                itemId: item ? item.id : null,
              });
            }

            if (
              btData.checkIteration > MAX_CHECK_TIMES &&
              status !== BlockchainTransaction.STATUS.SUCCESS
            )
              status = BlockchainTransaction.STATUS.FAILED;

            break;
          }
          default:
          //
        }

        try {
          await BlockchainTransaction.sequelize.transaction(async t => {
            await BlockchainTransaction.update(
              {
                status,
                data: btData,
              },
              {
                where: {
                  id: btId,
                  orderItemId: id,
                  status: BlockchainTransaction.STATUS.PENDING,
                },
                transaction: t,
              },
            );

            await BlockchainTransactionEventLog.create(
              {
                status,
                blockchainTransactionId: btId,
              },
              { transaction: t },
            );

            await OrderItemStatus.update(
              {
                txStatus: status,
              },
              {
                where: {
                  orderItemId: id,
                  blockchainTransactionId: btId,
                  txStatus: BlockchainTransaction.STATUS.PENDING,
                },
                transaction: t,
              },
            );
            if (status === BlockchainTransaction.STATUS.SUCCESS) {
              // todo: for now we have only 'twitter' domain fch that could be locked
              if (domain === 'twitter')
                await LockedFch.deleteLockedFch(
                  {
                    fch: fioApi.setFioName(address, domain),
                  },
                  { transaction: t },
                );
            }
          });

          // If transaction was marked as SUCCESS, update FIO payment with actual total
          if (status === BlockchainTransaction.STATUS.SUCCESS) {
            try {
              // Get payment ID for this order item
              const orderItemStatus = await OrderItemStatus.findOne({
                where: { orderItemId: id },
                include: [{ model: Payment, required: true }],
              });

              if (
                orderItemStatus &&
                orderItemStatus.Payment &&
                orderItemStatus.Payment.processor === Payment.PROCESSOR.FIO
              ) {
                await updateFioPaymentWithActualTotal(orderItemStatus.Payment.id);
              }
            } catch (paymentUpdateError) {
              logger.error(
                `FIO PAYMENT UPDATE ERROR after tx success ${item.id}`,
                paymentUpdateError,
              );
            }
          }

          return { success: true, itemId: id, orderId, status };
        } catch (error) {
          logger.error(`TX ITEM PROCESSING ERROR ${item.id} - SQL UPDATE`, error);
          return { success: false, itemId: id, orderId, error: error.message };
        }
      } catch (e) {
        logger.error(`TX ITEM PROCESSING ERROR ${item.id}`, e);
        return { success: false, itemId: id, orderId, error: e.message };
      }
    };

    const processOrderItems = items => async () => {
      if (this.isCancelled) return { success: false, reason: 'cancelled' };

      const { orderId } = items[0];

      // Process all items in this order in parallel chunks of 10
      const itemMethods = items.map(item => processTxItem(item));
      const ITEM_CHUNK_SIZE = 10;

      const results = [];

      for (let i = 0; i < itemMethods.length; i += ITEM_CHUNK_SIZE) {
        const chunk = itemMethods.slice(i, i + ITEM_CHUNK_SIZE);

        // Process items in this chunk in parallel using Promise.allSettled
        const chunkResults = await Promise.allSettled(chunk.map(method => method()));
        results.push(...chunkResults);
      }

      // Process results and collect status information
      const processedResults = results.map(result => {
        if (result.status === 'fulfilled') {
          const { success, itemId, status: txStatus, error } = result.value;
          if (success) {
            this.postMessage(
              `Item ${itemId} processed successfully with status: ${txStatus}`,
            );
          } else {
            logger.error(`Item ${itemId} processing failed: ${error}`);
          }
          return result.value;
        } else {
          logger.error(`Item processing rejected: ${result.reason}`);
          return { success: false, error: result.reason };
        }
      });

      // Update Order status after all items in the order are processed
      try {
        const items = await OrderItemStatus.getAllItemsStatuses(orderId);
        await updateOrderStatus(
          orderId,
          null,
          items.map(({ txStatus }) => txStatus),
        );

        return { success: true, orderId, processedResults };
      } catch (error) {
        logger.error(
          `TX ITEM PROCESSING ERROR - ORDER STATUS UPDATE - ${orderId}`,
          error,
        );
        return { success: false, orderId, error: error.message };
      }
    };

    const orderMethods = Object.values(bcTxOrderItems).map(items =>
      processOrderItems(items),
    );

    // Process order groups in chunks to avoid rate limiting
    const ORDER_CHUNK_SIZE = 5; // Reduced to 5 since each order can have multiple items
    const CHUNK_DELAY_MS = 500;

    this.postMessage(
      `Processing ${orderMethods.length} order groups in chunks of ${ORDER_CHUNK_SIZE}`,
    );

    for (let i = 0; i < orderMethods.length; i += ORDER_CHUNK_SIZE) {
      // Check if job has been cancelled
      if (this.isCancelled) {
        this.postMessage('Job cancelled during chunk processing');
        return false;
      }

      const chunk = orderMethods.slice(i, i + ORDER_CHUNK_SIZE);
      const chunkNumber = Math.floor(i / ORDER_CHUNK_SIZE) + 1;
      const totalChunks = Math.ceil(orderMethods.length / ORDER_CHUNK_SIZE);

      this.postMessage(
        `Processing chunk ${chunkNumber}/${totalChunks} (${chunk.length} order groups)`,
      );

      // Process all order groups in this chunk in parallel using Promise.allSettled
      const results = await Promise.allSettled(chunk.map(method => method()));

      // Log results
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          const { success, orderId, error } = result.value;
          if (success) {
            this.postMessage(`Order ${orderId} processed successfully`);
          } else {
            logger.error(`Order ${orderId} processing failed: ${error}`);
          }
        } else {
          logger.error(`Order processing rejected: ${result.reason}`);
        }
      });

      // Add delay between chunks to avoid rate limiting (except for the last chunk)
      if (i + ORDER_CHUNK_SIZE < orderMethods.length) {
        this.postMessage(`Waiting ${CHUNK_DELAY_MS}ms before next chunk...`);
        await new Promise(resolve => setTimeout(resolve, CHUNK_DELAY_MS));
      }
    }

    this.postMessage('All order groups processed successfully');

    this.finish();
  }
}

new TxCheckJob().execute();
