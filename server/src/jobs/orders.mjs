import '../db';

import {
  OrderItem,
  FioAccountProfile,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  OrderItemStatus,
  Payment,
  PaymentEventLog,
} from '../models/index.mjs';
import CommonJob from './job.mjs';

import sendInsufficientFundsNotification from '../services/fallback-funds-email.mjs';
import { fioApi, INSUFFICIENT_FUNDS_ERR_MESSAGE } from '../external/fio.mjs';

import { FIO_ADDRESS_DELIMITER, FIO_ACTIONS } from '../config/constants.js';

import logger from '../logger.mjs';

class OrdersJob extends CommonJob {
  constructor() {
    super();
  }

  async refundUser(orderItemProps) {
    try {
      const fioAmount = fioApi.convertUsdcToFio(orderItemProps.price, orderItemProps.roe);
      const fioNativeAmount = fioApi.amountToSUF(fioAmount);

      // Refund user for order
      const refundPayment = await Payment.create({
        status: Payment.STATUS.NEW,
        processor: Payment.PROCESSOR.SYSTEM,
        orderId: orderItemProps.orderId,
        spentType: Payment.SPENT_TYPE.ORDER_REFUND,
        price: fioAmount,
        currency: Payment.CURRENCY.FIO,
      });
      await PaymentEventLog.create({
        status: PaymentEventLog.STATUS.PENDING,
        statusNotes: '',
        paymentId: refundPayment.id,
      });

      const transferTokensTx = await fioApi.executeAction(
        FIO_ACTIONS.transferTokens,
        fioApi.getActionParams({
          ...orderItemProps,
          amount: fioNativeAmount,
          action: FIO_ACTIONS.transferTokens,
        }),
      );

      if (transferTokensTx.transaction_id) {
        refundPayment.status = Payment.STATUS.COMPLETED;
        await refundPayment.save();
        await PaymentEventLog.create({
          status: PaymentEventLog.STATUS.SUCCESS,
          statusNotes: '',
          paymentId: refundPayment.id,
        });

        logger.info(`REFUND ORDER ITEM ${orderItemProps.id}`);
        return;
      }

      const { notes } = fioApi.checkTxError(transferTokensTx);

      refundPayment.status = Payment.STATUS.CANCELLED;
      await refundPayment.save();
      await PaymentEventLog.create({
        status: PaymentEventLog.STATUS.REVIEW,
        statusNotes: notes,
        paymentId: refundPayment.id,
      });
    } catch (e) {
      logger.error(`REFUND ORDER ITEM ERROR ${orderItemProps.id}`, e);
    }
  }

  async execute() {
    await fioApi.getRawAbi();
    // get order items ready to process
    const items = await OrderItem.getActionRequired();

    this.postMessage(`Process order items - ${items.length}`);

    const defaultFioAccountProfile = await FioAccountProfile.getDefault();
    const processOrderItem = async item => {
      if (this.isCancelled) return false;

      const {
        id,
        orderId,
        address,
        domain,
        action,
        price,
        blockchainTransactionId,
        label,
        actor,
        permission,
      } = item;

      this.postMessage(`Processing item id - ${id}`);

      try {
        // Spend order payment on fio action
        await Payment.create({
          status: Payment.STATUS.COMPLETED,
          processor: Payment.PROCESSOR.SYSTEM,
          orderId,
          spentType: Payment.SPENT_TYPE.ACTION,
          price,
          currency: Payment.CURRENCY.USDC,
        });

        const fioName = (address ? address + FIO_ADDRESS_DELIMITER : '') + domain;
        const auth = {
          actor: defaultFioAccountProfile.actor,
          permission: defaultFioAccountProfile.permission,
        };

        // Set auth from fio account profile for registerFioAddress action
        if (action === OrderItem.ACTION.registerFioAddress) {
          auth.actor = actor;
          auth.permission = permission;
        }

        try {
          const result = await fioApi.executeAction(
            action,
            fioApi.getActionParams(item),
            auth,
          );

          if (result.transaction_id) {
            this.postMessage(
              `Processing item transactions created - ${id} / ${result.transaction_id}`,
            );
            await OrderItem.setPending(result, id, blockchainTransactionId);

            return;
          }

          // transaction failed
          const { notes } = fioApi.checkTxError(result);

          // Refund order payment for fio action
          await Payment.create({
            status: Payment.STATUS.COMPLETED,
            processor: Payment.PROCESSOR.SYSTEM,
            orderId,
            spentType: Payment.SPENT_TYPE.ACTION_REFUND,
            price,
            currency: Payment.CURRENCY.USDC,
          });

          // try to execute using fallback account when no funds
          if (
            notes === INSUFFICIENT_FUNDS_ERR_MESSAGE &&
            actor !== process.env.REG_FALLBACK_ACCOUNT
          ) {
            await sendInsufficientFundsNotification(fioName, label, auth);
            return processOrderItem({
              ...item,
              actor: process.env.REG_FALLBACK_ACCOUNT,
              permission: process.env.REG_FALLBACK_PERMISSION,
            });
          }

          await this.refundUser(item);

          await BlockchainTransaction.sequelize.transaction(async t => {
            await BlockchainTransaction.update(
              {
                status: BlockchainTransaction.STATUS.REVIEW,
              },
              {
                where: {
                  id: blockchainTransactionId,
                  orderItemId: id,
                  status: BlockchainTransaction.STATUS.READY,
                },
                transaction: t,
              },
            );

            await BlockchainTransactionEventLog.create(
              {
                status: BlockchainTransaction.STATUS.REVIEW,
                statusNotes: notes.slice(0, notes.length > 200 ? 200 : notes.length),
                blockchainTransactionId,
              },
              { transaction: t },
            );

            await OrderItemStatus.update(
              {
                txStatus: BlockchainTransaction.STATUS.REVIEW,
              },
              {
                where: {
                  orderItemId: id,
                  blockchainTransactionId,
                  txStatus: BlockchainTransaction.STATUS.READY,
                },
                transaction: t,
              },
            );
          });
        } catch (error) {
          logger.error(`ORDER ITEM PROCESSING ERROR ${item.id}`, error);
        }
      } catch (e) {
        logger.error(`ORDER ITEM PROCESSING ERROR ${item.id}`, e);
      }

      return true;
    };

    const methods = Object.values(items).map(item => processOrderItem(item));

    await this.executeActions(methods);

    this.finish();
  }
}

new OrdersJob().execute();
