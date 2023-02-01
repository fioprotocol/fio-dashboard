import Sequelize from 'sequelize';

import '../db';

import {
  OrderItem,
  FioAccountProfile,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  OrderItemStatus,
  Payment,
  PaymentEventLog,
  FreeAddress,
  Var,
  PublicWalletData,
  Wallet,
} from '../models/index.mjs';
import MathOp from '../services/math.mjs';
import CommonJob from './job.mjs';
import Stripe from '../external/payment-processor/stripe';
import BitPay from '../external/payment-processor/bitpay.mjs';

import sendInsufficientFundsNotification from '../services/fallback-funds-email.mjs';
import { updateOrderStatus as updateOrderStatusService } from '../services/updateOrderStatus.mjs';
import { getROE } from '../external/roe.mjs';
import { sleep } from '../tools.mjs';
import {
  FEES_UPDATE_TIMEOUT_SEC,
  FEES_VAR_KEY,
  fioApi,
  INSUFFICIENT_FUNDS_ERR_MESSAGE,
  INSUFFICIENT_BALANCE,
} from '../external/fio.mjs';
import { FioRegApi } from '../external/fio-reg.mjs';

import { FIO_ACTIONS } from '../config/constants.js';

import logger from '../logger.mjs';

const ERROR_CODES = {
  SINGED_TX_XTOKENS_REFUND_SKIP: 'SINGED_TX_XTOKENS_REFUND_SKIP',
};
const MAX_STATUS_NOTES_LENGTH = 200;
const TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION = 5000;

class OrdersJob extends CommonJob {
  constructor() {
    super();
    this.feesJson = {};
  }

  async getFeeForAction(action, forceUpdate = false) {
    let fee;

    if (
      this.feesUpdatedAt &&
      !Var.updateRequired(this.feesUpdatedAt, FEES_UPDATE_TIMEOUT_SEC) &&
      this.feesJson[action] &&
      !forceUpdate
    ) {
      fee = this.feesJson[action];
    } else {
      fee = await fioApi.getFee(action);
      this.feesJson[action] = fee;
      this.feesUpdatedAt = new Date();
      await Var.setValue(FEES_VAR_KEY, JSON.stringify(this.feesJson));
    }

    return fee;
  }

  async updateWalletDataBalance(publicKey) {
    try {
      const balanceResponse = await fioApi.getPublicFioSDK().getFioBalance(publicKey);
      const balance = balanceResponse.balance;

      const wallets = await Wallet.findAll({
        where: { publicKey },
        include: [{ model: PublicWalletData, as: 'publicWalletData' }],
        raw: true,
        nest: true,
      });

      await PublicWalletData.update(
        { balance },
        {
          where: {
            id: {
              [Sequelize.Op.in]: wallets
                .map(({ publicWalletData }) => publicWalletData && publicWalletData.id)
                .filter(id => id),
            },
          },
        },
      );
    } catch (e) {
      logger.error(
        `Public wallet data balance update error = ${publicKey} / ${e.message}`,
      );
    }
  }

  // Spend order payment on fio action
  async spend({
    fioName,
    orderId,
    action,
    spentType = Payment.SPENT_TYPE.ACTION,
    price,
    currency,
    status = Payment.STATUS.COMPLETED,
    data = null,
    notes = '',
    updateStatus = null,
    eventStatus = null,
    eventData = null,
    actionPaymentId = null,
  }) {
    try {
      let statusNotes = notes;
      if (statusNotes.length > MAX_STATUS_NOTES_LENGTH)
        statusNotes = statusNotes.slice(0, MAX_STATUS_NOTES_LENGTH);
      if (fioName && action) {
        if (!data) data = {};
        data = { ...data, fioName, action };
      }

      if (actionPaymentId && updateStatus && eventStatus) {
        await Payment.update(
          { status: updateStatus },
          { where: { id: actionPaymentId } },
        );
        await PaymentEventLog.create({
          status: eventStatus,
          statusNotes,
          data: eventData,
          paymentId: actionPaymentId,
        });

        return;
      }

      const actionPayment = await Payment.create({
        status,
        processor: Payment.PROCESSOR.SYSTEM,
        orderId,
        spentType,
        price,
        currency,
        data,
      });
      await PaymentEventLog.create({
        status: eventStatus || PaymentEventLog.STATUS.SUCCESS,
        statusNotes,
        data: eventData,
        paymentId: actionPayment.id,
      });

      return actionPayment;
    } catch (e) {
      logger.error(
        `Record spend error. orderId: ${orderId}, fioName: ${fioName}, error: ${e.message}`,
      );

      throw e;
    }
  }

  async handleFail(orderItem, errorNotes, errorData = null) {
    const { id, blockchainTransactionId } = orderItem;
    return BlockchainTransaction.sequelize.transaction(async t => {
      await BlockchainTransaction.update(
        {
          status: BlockchainTransaction.STATUS.FAILED,
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
          status: BlockchainTransaction.STATUS.FAILED,
          statusNotes: errorNotes.slice(
            0,
            errorNotes.length > MAX_STATUS_NOTES_LENGTH
              ? MAX_STATUS_NOTES_LENGTH
              : errorNotes.length,
          ),
          data: errorData ? { ...errorData } : null,
          blockchainTransactionId,
        },
        { transaction: t },
      );

      await OrderItemStatus.update(
        {
          txStatus: BlockchainTransaction.STATUS.FAILED,
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

  async refundUser(orderItemProps, errorData = {}) {
    try {
      const payment = await Payment.findOne({ where: { id: orderItemProps.paymentId } });

      let price;
      let nativePrice = null;
      let currency;
      let statusNotes;

      switch (payment.processor) {
        case Payment.PROCESSOR.STRIPE: {
          price = errorData.refundUsdcAmount || orderItemProps.price;
          currency = Payment.CURRENCY.USD;
          statusNotes = "User's credit card";
          break;
        }
        case Payment.PROCESSOR.BITPAY: {
          price = errorData.refundUsdcAmount || orderItemProps.price;
          currency = Payment.CURRENCY.USD;
          statusNotes = "User's crypto";
          break;
        }
        default:
          price = fioApi.convertUsdcToFio(orderItemProps.price, orderItemProps.roe);
          nativePrice = fioApi.amountToSUF(price);
          currency = Payment.CURRENCY.FIO;
          statusNotes = "User's FIO Wallet";
      }

      // Refund user for order
      const refundPayment = await Payment.create({
        status: Payment.STATUS.NEW,
        processor: Payment.PROCESSOR.SYSTEM,
        orderId: orderItemProps.orderId,
        spentType: Payment.SPENT_TYPE.ORDER_REFUND,
        data: {
          fioName: fioApi.setFioName(orderItemProps.address, orderItemProps.domain),
          action: orderItemProps.action,
        },
        price,
        currency,
      });
      await PaymentEventLog.create({
        status: PaymentEventLog.STATUS.PENDING,
        statusNotes,
        paymentId: refundPayment.id,
      });

      let refundTx;
      switch (payment.processor) {
        case Payment.PROCESSOR.STRIPE: {
          refundTx = await Stripe.refund(payment.externalId, price);
          break;
        }
        case Payment.PROCESSOR.BITPAY: {
          refundTx = await BitPay.refund(payment.externalId, price);
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
          statusNotes: `${statusNotes}. (${refundTx.transaction_id || refundTx.id})`,
          data: { fioTxId: refundTx.transaction_id, txId: refundTx.id },
          paymentId: refundPayment.id,
        });

        logger.info(`REFUND ORDER ITEM ${orderItemProps.id}`);
        return;
      }

      let refundError;
      switch (payment.processor) {
        case Payment.PROCESSOR.STRIPE: {
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
        status: PaymentEventLog.STATUS.FAILED,
        statusNotes: notes,
        data: { error: refundTx },
        paymentId: refundPayment.id,
      });
    } catch (e) {
      logger.error(`REFUND ORDER ITEM ERROR ${orderItemProps.id}`, e);
    }
  }

  async checkPriceChanges(orderItem, currentRoe) {
    let fee = await this.getFeeForAction(orderItem.action);

    if (orderItem.data && orderItem.data.hasCustomDomain) {
      const domainFee = await this.getFeeForAction(FIO_ACTIONS.registerFioDomain);
      fee = new MathOp(fee).add(domainFee).toNumber();
    }

    const currentPrice = fioApi.convertFioToUsdc(fee, currentRoe);

    const threshold = new MathOp(orderItem.price)
      .mul(0.25)
      .round(2, 1)
      .toNumber();

    const topThreshold = new MathOp(orderItem.price).add(threshold).toNumber();
    const bottomThreshold = new MathOp(orderItem.price).sub(threshold).toNumber();

    if (
      new MathOp(topThreshold).lt(currentPrice) ||
      new MathOp(bottomThreshold).gt(currentPrice)
    ) {
      await this.handleFail(
        orderItem,
        `PRICES_CHANGED - roe: ${currentRoe} - fee: ${fee}`,
      );
      await this.refundUser({ ...orderItem, roe: currentRoe });

      throw new Error(`PRICES_CHANGED - roe: ${currentRoe} - fee: ${fee}`);
    }
  }

  async registerFree(fioName, orderItem) {
    const { regRefCode, regRefApiToken, publicKey, orderId } = orderItem;

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
      await this.handleFail(orderItem, message);

      return this.updateOrderStatus(orderId);
    }

    if (res) {
      await OrderItem.setPending({}, orderItem.id, orderItem.blockchainTransactionId);
      this.postMessage(
        `Processing item transactions created (FREE) - ${orderItem.id} / ${JSON.stringify(
          res,
        )}`,
      );

      const freeAddressRecord = new FreeAddress({
        name: fioName,
        userId: orderItem.userId,
      });
      await freeAddressRecord.save();

      return;
    }

    logger.error(`Register free address error. No response data`);
    await this.handleFail(orderItem, 'Server error. No response data');
    return this.updateOrderStatus(orderId);
  }

  async checkTokensReceived(txId, publicKey) {
    // todo:
    this.postMessage(`Checking tokens received for ${publicKey} - ${txId}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async submitSignedTx(orderItem, auth, balanceDifference = null) {
    const { address, domain, action, orderId, paymentId, roe, data } = orderItem;
    const fee = this.feesJson[orderItem.action];
    const payment = await Payment.findOne({ where: { id: paymentId } });
    const isFIO = payment.processor === Payment.PROCESSOR.FIO;

    // Spend order payment on fio action
    const fioPayment = await this.spend({
      fioName: fioApi.setFioName(address, domain),
      action,
      orderId,
      status: Payment.STATUS.PENDING,
      eventStatus: PaymentEventLog.STATUS.PENDING,
      price: fioApi.sufToAmount(balanceDifference || fee),
      currency: Payment.CURRENCY.FIO,
      data: { roe, sendingFioTokens: true },
    });

    if (!isFIO) {
      // Send tokens to customer
      try {
        const transferRes = await fioApi.executeAction(
          FIO_ACTIONS.transferTokens,
          fioApi.getActionParams({
            publicKey: data.signingWalletPubKey || orderItem.publicKey,
            amount: balanceDifference || fee,
            action: FIO_ACTIONS.transferTokens,
          }),
          auth,
        );

        if (!transferRes.transaction_id) {
          const transferError = fioApi.checkTxError(transferRes);

          await this.spend({
            fioName: fioApi.setFioName(address, domain),
            action,
            orderId,
            spentType: Payment.SPENT_TYPE.ACTION_REFUND,
            price: fioApi.sufToAmount(balanceDifference || fee),
            currency: Payment.CURRENCY.FIO,
            data: {
              roe,
              error: transferError,
            },
            notes: `${transferError}`,
          });

          if (transferError.notes === INSUFFICIENT_BALANCE) return transferRes;

          throw new Error(JSON.stringify(transferError));
        }

        await this.checkTokensReceived(
          transferRes.transaction_id,
          data.signingWalletPubKey || orderItem.publicKey,
        );

        // Save transfer event
        await this.spend({
          actionPaymentId: fioPayment.id,
          updateStatus: Payment.STATUS.COMPLETED,
          eventStatus: PaymentEventLog.STATUS.SUCCESS,
          eventData: {
            fioTxId: transferRes.transaction_id,
            fioFee: transferRes.fee_collected,
          },
        });
      } catch (e) {
        // Save transfer error event
        await this.spend({
          actionPaymentId: fioPayment.id,
          updateStatus: Payment.STATUS.FAILED,
          eventStatus: PaymentEventLog.STATUS.FAILED,
          notes: e.message,
        });

        return {
          message: `Transfer Tokens error. Customer did not receive the tokens to execute the transaction - ${JSON.stringify(
            e,
          )}`,
          data: {
            refundUsdcAmount: fioApi.convertFioToUsdc(balanceDifference || fee, roe), // here roe has value on moment when order was created, not current value
          },
        };
      }
    }

    if (action === FIO_ACTIONS.renewFioDomain) {
      await sleep(TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION);
    }
    const result = await fioApi.executeTx(orderItem.action, data.signedTx);

    if (!result.transaction_id) {
      const { notes } = fioApi.checkTxError(result);

      if (notes === INSUFFICIENT_FUNDS_ERR_MESSAGE && !balanceDifference) {
        const updatedFee = await this.getFeeForAction(orderItem.action, true);

        if (new MathOp(updatedFee).gt(fee)) {
          return this.submitSignedTx(
            orderItem,
            auth,
            new MathOp(updatedFee).sub(fee).toString(),
          );
        }

        return {
          message: `Submit signed tx error, received '${INSUFFICIENT_FUNDS_ERR_MESSAGE}' but fee is not changed or even decreased.`,
          code: ERROR_CODES.SINGED_TX_XTOKENS_REFUND_SKIP,
          data: {
            credited: fee,
          },
        };
      }

      if (notes === INSUFFICIENT_FUNDS_ERR_MESSAGE && balanceDifference)
        return {
          message: `Submit signed tx error, received '${INSUFFICIENT_FUNDS_ERR_MESSAGE}' second time.`,
          code: ERROR_CODES.SINGED_TX_XTOKENS_REFUND_SKIP,
          data: {
            credited: fee,
          },
        };

      result.code = ERROR_CODES.SINGED_TX_XTOKENS_REFUND_SKIP;
      result.data = {
        credited: fee,
      };
    }

    await this.updateWalletDataBalance(orderItem.publicKey);

    return result;
  }

  // returns null when success and result when error
  async handleCustomDomain(orderItem, auth) {
    const { orderId, roe, domain, data } = orderItem;
    if (data.hasCustomDomain) {
      let error;
      try {
        await this.spend({
          fioName: domain,
          orderId,
          action: FIO_ACTIONS.registerFioDomain,
          price: fioApi.sufToAmount(data.hasCustomDomainFee),
          currency: Payment.CURRENCY.FIO,
          data: { roe },
        });

        const result = await fioApi.executeAction(
          FIO_ACTIONS.registerFioDomain,
          fioApi.getActionParams({
            action: FIO_ACTIONS.registerFioDomain,
            domain,
            publicKey: orderItem.publicKey,
            fee: await this.getFeeForAction(FIO_ACTIONS.registerFioDomain),
            tpid: orderItem.domainTpid,
          }),
          auth,
        );

        if (result.transaction_id) {
          const bcTx = await BlockchainTransaction.create({
            action: FIO_ACTIONS.registerFioDomain,
            txId: result.transaction_id,
            blockNum: result.block_num,
            blockTime: result.block_time ? result.block_time + 'Z' : new Date(),
            status: BlockchainTransaction.STATUS.SUCCESS,
            orderItemId: orderItem.id,
            feeCollected: result.fee_collected,
          });

          await BlockchainTransactionEventLog.create({
            status: BlockchainTransaction.STATUS.SUCCESS,
            blockchainTransactionId: bcTx.id,
          });

          return null;
        }

        error = result;
      } catch (e) {
        error = { error: e };
      }

      await this.spend({
        fioName: domain,
        orderId,
        action: FIO_ACTIONS.registerFioDomain,
        price: fioApi.sufToAmount(data.hasCustomDomainFee),
        currency: Payment.CURRENCY.FIO,
        spentType: Payment.SPENT_TYPE.ACTION_REFUND,
        data: { roe, error },
        notes: `${JSON.stringify(error)}`,
      });

      return error;
    }

    return null;
  }

  async executeOrderItemAction(orderItem, auth, hasSignedTx) {
    const { address, domain, action, price, orderId } = orderItem;

    // Register custom domain if needed
    const customDomainResult = await this.handleCustomDomain(orderItem, auth);
    if (customDomainResult) return customDomainResult;

    let result;
    if (hasSignedTx) {
      result = await this.submitSignedTx(orderItem, auth);
    } else {
      // Spend order payment on fio action
      await this.spend({
        fioName: fioApi.setFioName(address, domain),
        action,
        orderId,
        price,
        currency: Payment.CURRENCY.USDC,
      });

      if (action === FIO_ACTIONS.renewFioDomain) {
        await sleep(TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION);
      }
      result = await fioApi.executeAction(
        action,
        fioApi.getActionParams({
          ...orderItem,
          tpid:
            action === FIO_ACTIONS.registerFioDomain
              ? orderItem.domainTpid
              : orderItem.tpid,
          fee: await this.getFeeForAction(action),
        }),
        auth,
      );

      // No tx id. Refund order payment for fio action.
      if (!result.transaction_id)
        await this.spend({
          fioName: fioApi.setFioName(address, domain),
          action,
          orderId,
          spentType: Payment.SPENT_TYPE.ACTION_REFUND,
          price,
          currency: Payment.CURRENCY.USDC,
          data: { error: result },
          notes: `${JSON.stringify(result)}`,
        });
    }

    return result;
  }

  async updateOrderStatus(orderId) {
    try {
      const items = await OrderItemStatus.getAllItemsStatuses(orderId);

      await updateOrderStatusService(
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
  }

  async execute() {
    await fioApi.getRawAbi();
    const roe = await getROE();
    const feesVar = await Var.getByKey(FEES_VAR_KEY);
    this.feesJson = feesVar ? JSON.parse(feesVar.value) : {};
    this.feesUpdatedAt = feesVar ? feesVar.updatedAt : null;

    // get order items ready to process
    const items = await OrderItem.getActionRequired();

    this.postMessage(`Process order items - ${items.length}`);

    const defaultFioAccountProfile = await FioAccountProfile.getDefault();
    const processOrderItem = orderItem => async () => {
      if (this.isCancelled) return false;

      const {
        id,
        orderId,
        address,
        domain,
        action,
        data,
        price,
        blockchainTransactionId,
        label,
        actor,
        permission,
      } = orderItem;
      const hasSignedTx = data && !!data.signedTx;

      this.postMessage(`Processing item id - ${id}`);

      try {
        const fioName = fioApi.setFioName(address, domain);
        const auth = {
          actor: defaultFioAccountProfile.actor,
          permission: defaultFioAccountProfile.permission,
        };

        // Set auth from fio account profile for registerFioAddress action
        if (
          (action === OrderItem.ACTION.registerFioAddress && actor) ||
          actor === process.env.REG_FALLBACK_ACCOUNT
        ) {
          auth.actor = actor;
          auth.permission = permission;
        }

        // Handle free addresses
        if ((!price || price === '0') && address) {
          return this.registerFree(fioName, orderItem);
        }

        // Check if fee/roe changed and handle changes
        await this.checkPriceChanges(orderItem, roe);

        try {
          const result = await this.executeOrderItemAction(orderItem, auth, hasSignedTx);

          if (result.transaction_id) {
            this.postMessage(
              `Processing item transactions created - ${id} / ${result.transaction_id}`,
            );
            await OrderItem.setPending(result, id, blockchainTransactionId);

            return this.updateOrderStatus(orderId);
          }

          // transaction failed
          const { notes, code, data: errorData } = fioApi.checkTxError(result);

          // try to execute using fallback account when no funds
          if (
            (notes === INSUFFICIENT_FUNDS_ERR_MESSAGE ||
              notes === INSUFFICIENT_BALANCE) &&
            actor !== process.env.REG_FALLBACK_ACCOUNT
          ) {
            await sendInsufficientFundsNotification(fioName, label, auth);
            return processOrderItem({
              ...orderItem,
              actor: process.env.REG_FALLBACK_ACCOUNT,
              permission: process.env.REG_FALLBACK_PERMISSION,
            })();
          }

          await this.handleFail(orderItem, notes, { code, ...errorData });

          // Refund order payment for fio action. Do not refund if system sent tokens to user's wallet to execute signed tx
          if (code !== ERROR_CODES.SINGED_TX_XTOKENS_REFUND_SKIP)
            await this.refundUser(orderItem, errorData);
        } catch (error) {
          logger.error(`ORDER ITEM PROCESSING ERROR ${orderItem.id}`, error);
        }
      } catch (e) {
        logger.error(`ORDER ITEM PROCESSING ERROR ${orderItem.id}`, e);
      }

      await this.updateOrderStatus(orderId);

      return true;
    };

    // We want to process items in one order synchronously
    const methodsByOrder = items.reduce((acc, item) => {
      if (!acc[item.orderId]) acc[item.orderId] = [];
      acc[item.orderId].push(processOrderItem(item));

      return acc;
    }, {});

    await this.executeMethodsArray(Object.values(methodsByOrder), items.length);

    this.finish();
  }
}

new OrdersJob().execute();
