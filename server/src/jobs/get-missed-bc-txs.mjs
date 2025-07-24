import { GenericAction } from '@fioprotocol/fiosdk';

import '../db';
import {
  FioAccountProfile,
  OrderItem,
  OrderItemStatus,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  FioApiUrl,
  Payment,
} from '../models/index.mjs';
import { Var } from '../models/Var.mjs';
import CommonJob from './job.mjs';

import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';
import { SECOND_MS, VARS_KEYS } from '../config/constants';

import { fioApi, FIO_ACTION_NAMES } from '../external/fio.mjs';
import FioHistory from '../external/fio-history.mjs';
import MathOp from '../services/math.mjs';

import logger from '../logger.mjs';
import { sleep } from '../tools.mjs';

const loggerPrefix = 'BC TX';

class MissedTransactions extends CommonJob {
  async execute() {
    await fioApi.getRawAbi();

    const [orders] = await OrderItem.sequelize.query(`
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
`);

    logger.info(`${loggerPrefix} Found orders without bc txs: ${orders.length}`);

    const fioHistoryLimit = Number(await Var.getValByKey(VARS_KEYS.FIO_HISTORY_LIMIT));
    const maxRetries = Number(await Var.getValByKey(VARS_KEYS.DEFAULT_MAX_RETRIES));

    const fioHistoryUrls = await FioApiUrl.getApiUrls({
      type: FIO_API_URLS_TYPES.DASHBOARD_HISTORY_URL,
    });

    const fioHistory = new FioHistory({ fioHistoryUrls });

    for (const order of orders) {
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
        orderId,
        paymentProcessor,
        total,
      } = order;

      logger.info(`${loggerPrefix} Order: ${orderId}, orderItemId: ${orderItemId}`);

      const fioName = fioApi.setFioName(address, domain);

      let txPublicKey = publicKey;
      let foundActor = null;

      const accountsList = [];

      if (data && data.signingWalletPubKey) {
        txPublicKey = data.signingWalletPubKey;
      } else if (
        paymentProcessor === Payment.PROCESSOR.STRIPE ||
        paymentProcessor === Payment.PROCESSOR.BITPAY
      ) {
        txPublicKey = fioApi.getMasterPublicKey();

        const dashboardAccountActions = await FioAccountProfile.getPaidItems();

        if (dashboardAccountActions && dashboardAccountActions.length > 0) {
          accountsList.push(...dashboardAccountActions.map(account => account.actor));
        }
      } else if (
        paymentProcessor === Payment.PROCESSOR.FIO &&
        action === GenericAction.registerFioAddress &&
        !total
      ) {
        const dashboardAccountActions = await FioAccountProfile.getFreeItems();

        if (dashboardAccountActions && dashboardAccountActions.length > 0) {
          accountsList.push(...dashboardAccountActions.map(account => account.actor));
        }
      }

      const actor = await fioApi.getActor(txPublicKey);
      if (actor) {
        accountsList.unshift(actor);
      }

      // Remove duplicates from accountsList
      const uniqueAccountsList = [...new Set(accountsList)];
      accountsList.length = 0;
      accountsList.push(...uniqueAccountsList);

      const afterTimeForSearch = new Date(createdAt).toISOString();

      try {
        let addressTransactionHistory = null;

        const findMissedTxInAccountHistoryActions = async params => {
          const accountHistoryActions = await fioHistory.requestHistoryActions({
            params,
          });

          if (accountHistoryActions) {
            if (accountHistoryActions.actions) {
              const foundMissedTx = accountHistoryActions.actions.find(
                ({ act }) =>
                  act.name === FIO_ACTION_NAMES[action] &&
                  act.data &&
                  (act.data.fio_address === fioName || act.data.fio_domain === fioName),
              );

              if (foundMissedTx) {
                addressTransactionHistory = foundMissedTx;
              } else if (
                // Keep search for missed transaction if not found on results and there are more actions for that account
                !foundMissedTx &&
                new MathOp(accountHistoryActions.total.value).gt(
                  accountHistoryActions.actions.length,
                )
              ) {
                const lastActionItem =
                  accountHistoryActions.actions[accountHistoryActions.actions.length - 1];

                logger.info(
                  `${loggerPrefix} Get More Items before: ${lastActionItem.timestamp}`,
                );
                await sleep(SECOND_MS);
                await findMissedTxInAccountHistoryActions({
                  ...params,
                  before: lastActionItem.timestamp,
                });
              }
            }
          }
        };

        for (const account of accountsList) {
          logger.info(`${loggerPrefix} Getting for account: ${account}`);
          const searchTxParams = {
            account,
            limit: Number(fioHistoryLimit),
            simple: false,
            noBinary: true,
            sort: 'desc',
            after: afterTimeForSearch,
          };

          await findMissedTxInAccountHistoryActions(searchTxParams);

          if (addressTransactionHistory) {
            foundActor = account;
            logger.info(`${loggerPrefix} Found Actor: ${foundActor}`);
            break;
          }
        }

        if (!addressTransactionHistory) {
          logger.error(
            `${loggerPrefix} Update: no data returned from tx history for order: ${orderId}, order item id ${orderItemId}`,
          );

          continue;
        }

        const {
          block_num,
          timestamp,
          trx_id,
          act: { data: { max_fee: paramsMaxFee } = {} } = {},
        } = addressTransactionHistory || {};

        let max_fee = paramsMaxFee;

        if (trx_id) {
          const transactionData = await fioHistory.getTransaction({
            transactionId: trx_id,
            maxRetries,
          }); // Get fee that was collected on tx

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
                `${loggerPrefix} Already exists in: orderItemId - ${bcTxExists.orderItemId}, blockchainTransactionId: ${bcTxExists.id}`,
              );
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

    this.finish();
  }
}

new MissedTransactions().execute();
