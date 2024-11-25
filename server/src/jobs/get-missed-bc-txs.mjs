import '../db';
import {
  OrderItem,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  FioApiUrl,
} from '../models/index.mjs';
import CommonJob from './job.mjs';

import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';

import { fioApi } from '../external/fio.mjs';
import FioHistory from '../external/fio-history.mjs';

import logger from '../logger.mjs';

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
        ois.id as "orderItemStatusId",
        bt.id as "blockchainTransactionId",
        bt."txId" as "txId"
      FROM "order-items" oi 
	    INNER JOIN orders o ON o.id = oi."orderId" 
	    LEFT JOIN "order-items-status" ois ON ois."orderItemId" = oi.id
      LEFT JOIN "blockchain-transactions" bt ON bt."orderItemId" = oi.id
      WHERE o.status = 7 AND oi."deletedAt" IS NUll
        AND o."deletedAt" IS NUll 
        AND bt."deletedAt" IS NUll 
        AND (bt.id is NULL OR (bt."txId" IS NULL AND ois."blockchainTransactionId" = bt.id))
      ORDER by o."createdAt" DESC
`);

    logger.info(`Found orders without bc txs: ${orders.length}`);

    for (const order of orders) {
      const {
        action,
        address,
        domain,
        publicKey,
        blockchainTransactionId,
        orderItemId,
        orderId,
      } = order;
      const fioName = fioApi.setFioName(address, domain);

      const actor = await fioApi.getActor(publicKey);

      const fioHistoryUrls = await FioApiUrl.getApiUrls({
        type: FIO_API_URLS_TYPES.DASHBOARD_HISTORY_URL,
      });

      try {
        const res = await new FioHistory({ fioHistoryUrls }).requestHistory({
          account_name: actor,
          offset: -100,
          pos: -1,
        });

        const addressTransactionHistory =
          res && res.actions
            ? res.actions
                .filter(action => action.action_trace.receiver === 'fio.address')
                .find(
                  action =>
                    action.action_trace.act.data.fio_address ||
                    action.action_trace.act.data.fio_domain === fioName,
                )
            : null;

        if (!addressTransactionHistory) {
          logger.error(
            `BC TX Update: no data returned from tx history, res - ${JSON.stringify(
              res,
            )}`,
          );

          return this.finish();
        }

        const {
          block_num,
          block_time,
          action_trace: { trx_id, act: { data: { max_fee } = {} } = {} } = {},
        } = addressTransactionHistory || {};

        await BlockchainTransaction.sequelize.transaction(async t => {
          const bcTxExists = await BlockchainTransaction.findOne({
            where: { txId: trx_id },
          });
          if (!bcTxExists) {
            if (blockchainTransactionId) {
              await BlockchainTransaction.update(
                {
                  status: BlockchainTransaction.STATUS.SUCCESS,
                  feeCollected: max_fee,
                  blockTime: block_time ? block_time + 'Z' : new Date(),
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
            } else {
              const bcTx = await BlockchainTransaction.create(
                {
                  status: BlockchainTransaction.STATUS.SUCCESS,
                  feeCollected: max_fee,
                  blockTime: block_time,
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
            }
          } else {
            logger.error(
              `BC TX Already exists in: orderItemId - ${bcTxExists.orderItemId}, blockchainTransactionId: ${bcTxExists.id}`,
            );
          }
        });
      } catch (e) {
        logger.error(
          `BC TX Update Error: order id - ${orderId}, orderItemId - ${orderItemId}, blockchainTransactionId: ${blockchainTransactionId}`,
          e,
        );
      }
    }

    this.finish();
  }
}

new MissedTransactions().execute();
