import '../db';

import {
  OrderItem,
  FioAccountProfile,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  OrderItemStatus,
  Payment,
  PaymentEventLog,
  Order,
  FreeAddress,
} from '../models/index.mjs';
import MathOp from '../services/math.mjs';
import CommonJob from './job.mjs';
import Stripe from '../external/payment-processor/stripe';

import sendInsufficientFundsNotification from '../services/fallback-funds-email.mjs';
import { getROE } from '../external/roe.mjs';
import { fioApi, INSUFFICIENT_FUNDS_ERR_MESSAGE } from '../external/fio.mjs';
import { FioRegApi } from '../external/fio-reg.mjs';

import { FIO_ADDRESS_DELIMITER, FIO_ACTIONS } from '../config/constants.js';

import logger from '../logger.mjs';

class OrdersJob extends CommonJob {
  constructor() {
    super();
  }

  async handleFail(item, errorNotes) {
    const { id, blockchainTransactionId } = item;
    return BlockchainTransaction.sequelize.transaction(async t => {
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
          statusNotes: errorNotes.slice(
            0,
            errorNotes.length > 200 ? 200 : errorNotes.length,
          ),
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
  }

  async refundUser(orderItemProps) {
    try {
      const payment = await Payment.findOne({ where: { id: orderItemProps.paymentId } });

      let price;
      let nativePrice = null;
      let currency;

      switch (payment.processor) {
        case Payment.PROCESSOR.CREDIT_CARD: {
          price = orderItemProps.price;
          currency = Payment.CURRENCY.USD;
          break;
        }
        default:
          price = fioApi.convertUsdcToFio(orderItemProps.price, orderItemProps.roe);
          nativePrice = fioApi.amountToSUF(price);
          currency = Payment.CURRENCY.FIO;
      }

      // Refund user for order
      const refundPayment = await Payment.create({
        status: Payment.STATUS.NEW,
        processor: Payment.PROCESSOR.SYSTEM,
        orderId: orderItemProps.orderId,
        spentType: Payment.SPENT_TYPE.ORDER_REFUND,
        price,
        currency,
      });
      await PaymentEventLog.create({
        status: PaymentEventLog.STATUS.PENDING,
        statusNotes: '',
        paymentId: refundPayment.id,
      });

      let refundTx;
      switch (payment.processor) {
        case Payment.PROCESSOR.CREDIT_CARD: {
          refundTx = await Stripe.refund(payment.externalId, price);
          break;
        }
        default:
          refundTx = await fioApi.executeAction(
            FIO_ACTIONS.transferTokens,
            fioApi.getActionParams({
              ...orderItemProps,
              amount: nativePrice,
              action: FIO_ACTIONS.transferTokens,
            }),
          );
      }

      if (refundTx.transaction_id || refundTx.id) {
        refundPayment.status = Payment.STATUS.COMPLETED;
        await refundPayment.save();
        await PaymentEventLog.create({
          status: PaymentEventLog.STATUS.SUCCESS,
          statusNotes: JSON.stringify(refundTx),
          paymentId: refundPayment.id,
        });

        logger.info(`REFUND ORDER ITEM ${orderItemProps.id}`);
        return;
      }

      let refundError;
      switch (payment.processor) {
        case Payment.PROCESSOR.CREDIT_CARD: {
          refundError = { notes: JSON.stringify(refundTx) };
          break;
        }
        default:
          refundError = fioApi.checkTxError(refundTx);
      }
      const { notes } = refundError;

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

  async checkPriceChanges(item, currentRoe) {
    const fee = await fioApi.getFee(item.action);
    const currentPrice = fioApi.convertFioToUsdc(fee, currentRoe);

    const threshold = new MathOp(currentPrice)
      .mul(0.25)
      .round(2, 1)
      .toNumber();

    const topThreshold = new MathOp(currentPrice).add(threshold).toNumber();
    const bottomThreshold = new MathOp(currentPrice).sub(threshold).toNumber();

    if (
      new MathOp(topThreshold).lt(item.price) ||
      new MathOp(bottomThreshold).gt(item.price)
    ) {
      await this.refundUser({ ...item, roe: currentRoe });
      await this.handleFail(item, `PRICES_CHANGED - roe: ${currentRoe} - fee: ${fee}`);

      throw new Error(`PRICES_CHANGED - roe: ${currentRoe} - fee: ${fee}`);
    }
  }

  async registerFree(fioName, item) {
    const { regRefCode, regRefApiToken, publicKey } = item;

    let res;
    try {
      res = await FioRegApi.register({
        address: fioName,
        publicKey,
        referralCode: regRefCode,
        apiToken: regRefApiToken,
      });
    } catch (error) {
      let message = error.message;
      if (error.response && error.response.body) {
        message = error.response.body.error;
      }
      logger.error(`Register free address error: ${message}`);
      return this.handleFail(item, message);
    }

    if (res) {
      await OrderItem.setPending(
        {
          transaction_id: 'free',
          block_num: 0,
        },
        item.orderId,
        item.blockchainTransactionId,
      );
      this.postMessage(
        `Processing item transactions created (FREE) - ${item.id} / ${JSON.stringify(
          res,
        )}`,
      );

      const freeAddressRecord = new FreeAddress({
        name: fioName,
        userId: item.userId,
      });
      await freeAddressRecord.save();

      return;
    }

    logger.error(`Register free address error. No response data`);
    return this.handleFail(item, 'Server error. No response data');
  }

  async execute() {
    await fioApi.getRawAbi();
    const roe = await getROE();
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

        // Handle free addresses
        if (!price || price === '0') {
          return this.registerFree(fioName, item);
        }

        // Check if fee/roe changed and handle changes
        await this.checkPriceChanges(item, roe);

        // Spend order payment on fio action
        await Payment.create({
          status: Payment.STATUS.COMPLETED,
          processor: Payment.PROCESSOR.SYSTEM,
          orderId,
          spentType: Payment.SPENT_TYPE.ACTION,
          price,
          currency: Payment.CURRENCY.USDC,
        });

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

          await this.handleFail(item, notes);

          // Update Order status
          try {
            const items = await OrderItemStatus.getAllItemsStatuses(orderId);

            await Order.updateStatus(
              orderId,
              null,
              items.map(({ txStatus }) => txStatus),
            );
          } catch (error) {
            logger.error(
              `ORDER ITEM PROCESSING ERROR - ORDER STATUS UPDATE - ${orderId}`,
              error,
            );
          }
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
