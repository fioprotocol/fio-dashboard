import Sequelize from 'sequelize';

import '../db';

import { GenericAction } from '@fioprotocol/fiosdk';

import {
  Domain,
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
  ReferrerProfile,
  User,
  Wallet,
} from '../models/index.mjs';
import MathOp from '../services/math.mjs';
import CommonJob from './job.mjs';
import Stripe from '../external/payment-processor/stripe';
import BitPay from '../external/payment-processor/bitpay.mjs';

import sendInsufficientFundsNotification from '../services/fallback-funds-email.mjs';
import { updateOrderStatus as updateOrderStatusService } from '../services/updateOrderStatus.mjs';
import { updateFioPaymentWithActualTotal } from '../utils/payment.mjs';
import { getROE } from '../external/roe.mjs';
import { sleep } from '../tools.mjs';
import {
  FEES_UPDATE_TIMEOUT_SEC,
  FEES_VAR_KEY,
  fioApi,
  INSUFFICIENT_FUNDS_ERR_MESSAGE,
  INSUFFICIENT_BALANCE,
} from '../external/fio.mjs';
import { convertFioPrices } from '../utils/cart.mjs';

import {
  FIO_ACCOUNT_TYPES,
  USER_HAS_FREE_ADDRESS_MESSAGE,
  NO_REQUIRED_SIGNED_TX_MESSAGE,
  ORDER_ERROR_TYPES,
  FIO_ADDRESS_DELIMITER,
} from '../config/constants.js';

import { METAMASK_DOMAIN_NAME, NON_VALID_FCH } from '../constants/fio.mjs';
import { ORDER_USER_TYPES } from '../constants/order.mjs';

import logger from '../logger.mjs';
import {
  checkIfOrderedDomainRegisteredInBlockchain,
  getDomainOnOrder,
  generateUniqueExpirationOffset,
} from '../utils/jobs/orders.mjs';

const ERROR_CODES = {
  SINGED_TX_XTOKENS_REFUND_SKIP: 'SINGED_TX_XTOKENS_REFUND_SKIP',
};
const MAX_STATUS_NOTES_LENGTH = 200;
const TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION = 5000;

// Constants for chunk processing
const CHUNK_SIZE = 15;
const MAX_CONCURRENT_CHUNKS = 3; // Maximum chunks running in parallel

const TIME_TO_WAIT_BEFORE_DEPENDED_TX_EXECUTE = process.env
  .TIME_TO_WAIT_BEFORE_DEPENDED_TX_EXECUTE
  ? parseInt(process.env.TIME_TO_WAIT_BEFORE_DEPENDED_TX_EXECUTE)
  : TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION;

const NO_REQUIRED_SIGNED_TX = `Register address error: ${NO_REQUIRED_SIGNED_TX_MESSAGE}`;
const USER_HAS_FREE_ERROR = `Register free address error: ${USER_HAS_FREE_ADDRESS_MESSAGE}`;
const CANNOT_IDENTIFY_USER = `Register free address error: Cannot identify user. User id and public key are missing`;

class OrdersJob extends CommonJob {
  constructor() {
    super();
    this.feesJson = {};
    this.feesUpdatedAt = null;
    // Track orders where domain registration has been confirmed successful
    this.orderDomainRegistrationCompleted = new Set();
  }

  async getFeeForAction(action, forceUpdate = false) {
    let fee = null;

    // Check local cache first
    if (
      this.feesUpdatedAt &&
      !Var.updateRequired(this.feesUpdatedAt, FEES_UPDATE_TIMEOUT_SEC) &&
      this.feesJson[action] &&
      !forceUpdate
    ) {
      fee = this.feesJson[action];
      this.postMessage(`Fees (cached): ${JSON.stringify({ action, fee })}`);
    } else {
      // Get all fees and update local cache
      try {
        const fees = await fioApi.getAllFees({ forceUpdate });
        if (fees) {
          this.feesJson = fees;
          this.feesUpdatedAt = new Date();
          fee = fees[action];
        }
        this.postMessage(`Fees (updated): ${JSON.stringify({ action, fee })}`);
      } catch (error) {
        logger.error(`GET FEE FOR ACTION ${action} FAILED: `, error);
        // Fallback to cached value if available
        fee = this.feesJson[action] || null;
      }
    }

    return fee;
  }

  async updateWalletDataBalance(publicKey) {
    try {
      const publicFioSDK = await fioApi.getPublicFioSDK();
      const balanceResponse = await publicFioSDK.getFioBalance(publicKey);
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
      const payment = await Payment.findOne({
        where: { id: orderItemProps.paymentId },
      });

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

      if (new MathOp(price).gt(orderItemProps.total)) {
        refundPayment.status = Payment.STATUS.CANCELLED;
        const errorMessage = 'Refund price is bigger than total order price';

        await refundPayment.save();
        await PaymentEventLog.create({
          status: PaymentEventLog.STATUS.FAILED,
          statusNotes: errorMessage,
          paymentId: refundPayment.id,
        });
        throw new Error(errorMessage);
      }

      if (!price || price === '0' || price === 0) {
        refundPayment.status = Payment.STATUS.CANCELLED;
        const errorMessage = 'Refund price is 0';

        await refundPayment.save();
        await PaymentEventLog.create({
          status: PaymentEventLog.STATUS.FAILED,
          statusNotes: errorMessage,
          paymentId: refundPayment.id,
        });
        throw new Error(errorMessage);
      }

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
          refundTx = await fioApi.executeAction({
            action: GenericAction.transferTokens,
            params: fioApi.getActionParams({
              ...orderItemProps,
              amount: nativePrice,
              action: GenericAction.transferTokens,
            }),
            returnBaseUrl: true,
            currentBaseUrl: orderItemProps.baseUrl,
          });
      }

      if (refundTx.transaction_id || refundTx.id) {
        refundPayment.status = Payment.STATUS.COMPLETED;
        await refundPayment.save();
        await PaymentEventLog.create({
          status: PaymentEventLog.STATUS.SUCCESS,
          statusNotes: `${statusNotes}. (${refundTx.transaction_id || refundTx.id})`,
          data: {
            fioTxId: refundTx.transaction_id,
            txId: refundTx.id,
            baseUrl: refundTx.baseUrl,
          },
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
    const fee = await this.getFeeForAction(orderItem.action);

    const currentPrice = fioApi.convertFioToUsdc(fee, currentRoe);
    this.postMessage(`CURRENT PRICE, ${currentPrice}`);
    this.postMessage(`orderItem.price, ${orderItem.price}`);
    const threshold = new MathOp(orderItem.price)
      .mul(0.25)
      .round(2, 1)
      .toString();
    this.postMessage(`threshold, ${threshold}`);
    const topThreshold = new MathOp(orderItem.price).add(threshold).toString();
    const bottomThreshold = new MathOp(orderItem.price).sub(threshold).toString();
    this.postMessage(`topThreshold, ${topThreshold}`);
    this.postMessage(`bottomThreshold, ${bottomThreshold}`);
    if (
      new MathOp(topThreshold).lt(currentPrice) ||
      new MathOp(bottomThreshold).gt(currentPrice)
    ) {
      const percentageChange = new MathOp(orderItem.price)
        .sub(currentPrice)
        .div(orderItem.price)
        .mul(100)
        .round(2, 1)
        .toString();
      this.postMessage(`percentageChange, ${percentageChange}`);
      const priceChangePercentage = new MathOp(percentageChange).gt(0)
        ? `-${percentageChange}`
        : `+${new MathOp(percentageChange).abs().toString()}`;
      this.postMessage(`priceChangePercentage, ${priceChangePercentage}`);

      if (
        orderItem.data &&
        orderItem.data.orderUserType === ORDER_USER_TYPES.PARTNER_API_CLIENT &&
        orderItem.processor === Payment.PROCESSOR.BITPAY &&
        new MathOp(orderItem.total).eq(1)
      ) {
        this.postMessage(
          'Skipping price check for partner API because of min BitPay price',
        );
      } else {
        const errorMessage = `PRICES_CHANGED on ${priceChangePercentage}% - (current/previous) - order price: $${currentPrice}/$${orderItem.price} - roe: ${currentRoe}/${orderItem.roe} - fee: ${fee}/${orderItem.nativeFio}.`;

        await this.handleFail(orderItem, errorMessage);
        await this.refundUser({ ...orderItem, roe: currentRoe });

        throw new Error(errorMessage);
      }
    }
  }

  async registerFree({
    fioName,
    auth,
    orderItem,
    fallbackFreeFioActor,
    fallbackFreeFioPermission,
    processOrderItem,
    registeringDomainExistingInAppDomainsList,
    allRefProfileDomains,
  }) {
    const {
      id,
      domain,
      blockchainTransactionId,
      label,
      orderId,
      userId,
      freeId,
      publicKey,
    } = orderItem;
    this.postMessage(
      `START FREE REGISTRATION' : ${id}, ${domain}, ${blockchainTransactionId} ${label} ${orderId} ${userId} ${publicKey}`,
    );

    if (!freeId) {
      logger.error(CANNOT_IDENTIFY_USER);

      await this.handleFail(orderItem, USER_HAS_FREE_ERROR, {
        errorType: ORDER_ERROR_TYPES.userHasFreeAddress,
      });

      return this.updateOrderStatus(orderId);
    }

    const userHasFreeAddress = await FreeAddress.getItems({
      freeId: orderItem.freeId,
    });

    const existingUsersFreeAddress =
      userHasFreeAddress &&
      userHasFreeAddress.find(
        freeAddress => freeAddress.name.split(FIO_ADDRESS_DELIMITER)[1] === domain,
      );

    if (
      userHasFreeAddress &&
      userHasFreeAddress.length &&
      (!registeringDomainExistingInAppDomainsList.isFirstRegFree ||
        (registeringDomainExistingInAppDomainsList.isFirstRegFree &&
          existingUsersFreeAddress))
    ) {
      let allowFree = false;
      // check if item in the order with other isFirstRegFree item
      if (orderItem.code && orderItem.data && orderItem.data.isNoProfileFlow) {
        const orderItems = await OrderItem.findAll({
          raw: true,
          where: {
            orderId: orderItem.orderId,
            id: { [Sequelize.Op.ne]: orderItem.id },
          },
        });
        if (orderItems && orderItems.length > 0) {
          allowFree = !!orderItems.find(otherOrderItem => {
            if (
              otherOrderItem.price !== '0' ||
              otherOrderItem.action !== GenericAction.registerFioAddress
            ) {
              return false;
            }

            const refProfileDomain = allRefProfileDomains.find(
              refProfileDomain =>
                refProfileDomain.code === orderItem.code &&
                refProfileDomain.name === otherOrderItem.domain,
            );

            return refProfileDomain && refProfileDomain.isFirstRegFree;
          });
        }
      }

      if (!allowFree) {
        logger.error(USER_HAS_FREE_ERROR);

        await this.handleFail(orderItem, USER_HAS_FREE_ERROR, {
          errorType: ORDER_ERROR_TYPES.userHasFreeAddress,
        });
        return this.updateOrderStatus(orderId);
      }
    }

    try {
      const result = await this.executeOrderItemAction(orderItem, auth);

      if (result.transaction_id) {
        this.postMessage(
          `Processing item transactions created (FREE) - ${id} / ${result.transaction_id}`,
        );
        await OrderItem.setPending(result, id, blockchainTransactionId);

        const freeAddressRecord = await new FreeAddress({
          name: fioName,
          freeId: orderItem.freeId,
        });

        await freeAddressRecord.save();

        return this.updateOrderStatus(orderId);
      }
      // transaction failed
      const { notes, code, data: errorData } = fioApi.checkTxError(result);

      // try to execute using fallback account when no funds
      if (
        (notes === INSUFFICIENT_FUNDS_ERR_MESSAGE || notes === INSUFFICIENT_BALANCE) &&
        auth.actor !== fallbackFreeFioActor
      ) {
        await sendInsufficientFundsNotification(fioName, label, auth);
        return processOrderItem({
          ...orderItem,
          freeActor: fallbackFreeFioActor
            ? fallbackFreeFioActor
            : process.env.REG_FALLBACK_ACCOUNT,
          freePermission: fallbackFreeFioPermission
            ? fallbackFreeFioPermission
            : process.env.REG_FALLBACK_PERMISSION,
        })();
      }

      await this.handleFail(orderItem, notes, {
        code,
        ...errorData,
        errorType: ORDER_ERROR_TYPES.freeAddressError,
      });
    } catch (error) {
      let message = error.message;
      if (error.response && error.response.body) {
        message = error.response.body.error;
      }
      logger.error(`Register free address error: ${message}`);
    }

    await this.updateOrderStatus(orderId);

    return true;
  }

  async checkTokensReceived(txId, publicKey) {
    // todo:
    this.postMessage(`Checking tokens received for ${publicKey} - ${txId}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async checkIfDomainOnOrderRegistered({ orderItem, action, errorMessage }) {
    const domainOnOrder = await getDomainOnOrder(orderItem, action);
    if (domainOnOrder) {
      // Check if this order's domain registration has been confirmed successful
      const orderKey = `${orderItem.orderId}-${domainOnOrder.domain}`;
      const isDomainRegistrationConfirmed = this.orderDomainRegistrationCompleted.has(
        orderKey,
      );

      // If already confirmed, no need to check again
      if (isDomainRegistrationConfirmed) {
        return;
      }

      await sleep(TIME_TO_WAIT_BEFORE_DEPENDED_TX_EXECUTE);

      // Check if domain is registered
      const isDomainRegistered = await checkIfOrderedDomainRegisteredInBlockchain(
        domainOnOrder,
        {
          errorMessage,
          onFail: err => this.handleFail(orderItem, err),
          fioApi,
        },
      );

      // If domain registration is confirmed successful, mark this order so future renewals skip sleep
      if (isDomainRegistered) {
        this.orderDomainRegistrationCompleted.add(orderKey);
      }
    }
  }

  async enableCheckBalanceNotificationCreate(currentWallet) {
    await currentWallet.update({
      data: {
        ...currentWallet.data,
        isChangeBalanceNotificationCreateStopped: false,
      },
    });
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

    const currentWallet = await Wallet.findOne({
      where: { publicKey: data.signingWalletPubKey || orderItem.publicKey },
    });

    if (!isFIO) {
      // Send tokens to customer

      if (currentWallet) {
        await currentWallet.update({
          data: {
            ...currentWallet.data,
            isChangeBalanceNotificationCreateStopped: true,
          },
        });
      }

      try {
        const transferRes = await fioApi.executeAction({
          action: GenericAction.transferTokens,
          params: fioApi.getActionParams({
            publicKey: data.signingWalletPubKey || orderItem.publicKey,
            amount: balanceDifference || fee,
            action: GenericAction.transferTokens,
          }),
          auth,
          returnBaseUrl: true,
          currentBaseUrl: orderItem.baseUrl,
        });

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

        currentWallet && (await this.enableCheckBalanceNotificationCreate(currentWallet));

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

    if (action === GenericAction.renewFioDomain) {
      await this.checkIfDomainOnOrderRegistered({
        orderItem,
        action: GenericAction.registerFioDomain,
        errorMessage: `RenewDomain has been canceled because domain - ${orderItem.domain} - from this order has not been registered`,
      });
    }

    if (action === GenericAction.registerFioAddress) {
      await this.checkIfDomainOnOrderRegistered({
        orderItem,
        action: GenericAction.registerFioDomainAddress,
        errorMessage: `RegisterFioHandle has been canceled because domain - ${orderItem.domain} - from this order has not been registered`,
      });
    }

    const result = await fioApi.executeTx({
      action: orderItem.action,
      signedTx: data.signedTx,
      currentBaseUrl: orderItem.baseUrl,
    });

    if (!result.transaction_id) {
      const { notes } = fioApi.checkTxError(result);

      currentWallet && (await this.enableCheckBalanceNotificationCreate(currentWallet));

      if (notes === INSUFFICIENT_FUNDS_ERR_MESSAGE && !balanceDifference) {
        const updatedFee = await this.getFeeForAction(orderItem.action, true);
        this.postMessage('updatedFee', updatedFee);
        this.postMessage('fee', fee);
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

    if (!isFIO) {
      await this.updateWalletDataBalance(orderItem.publicKey);
      currentWallet && (await this.enableCheckBalanceNotificationCreate(currentWallet));
    }

    if (
      currentWallet &&
      currentWallet.data &&
      currentWallet.data.isChangeBalanceNotificationCreateStopped
    ) {
      await this.enableCheckBalanceNotificationCreate(currentWallet);
    }

    return result;
  }

  // returns null when success and result when error
  async handleCustomDomain(orderItem, auth) {
    const { orderId, roe, domain, data } = orderItem;
    if (data && data.hasCustomDomain) {
      let error;
      try {
        await this.spend({
          fioName: domain,
          orderId,
          action: GenericAction.registerFioDomain,
          price: fioApi.sufToAmount(data.hasCustomDomainFee),
          currency: Payment.CURRENCY.FIO,
          data: { roe },
        });

        const result = await fioApi.executeAction({
          action: GenericAction.registerFioDomain,
          params: fioApi.getActionParams({
            action: GenericAction.registerFioDomain,
            domain,
            publicKey: orderItem.publicKey,
            fee: await this.getFeeForAction(GenericAction.registerFioDomain),
            tpid: orderItem.affiliateTpid,
          }),
          auth,
          returnBaseUrl: true,
          currentBaseUrl: orderItem.baseUrl,
        });

        if (result.transaction_id) {
          const bcTx = await BlockchainTransaction.create({
            action: GenericAction.registerFioDomain,
            txId: result.transaction_id,
            blockNum: result.block_num,
            blockTime: result.block_time ? result.block_time + 'Z' : new Date(),
            status: BlockchainTransaction.STATUS.SUCCESS,
            orderItemId: orderItem.id,
            feeCollected: result.fee_collected,
            baseUrl: result.baseUrl,
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
        action: GenericAction.registerFioDomain,
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

  async executeOrderItemAction(orderItem, auth, hasSignedTx, disableRefund) {
    const { address, domain, action, price, orderId } = orderItem;
    this.postMessage('EXECUTE ORDER ITEM ACTION', JSON.stringify(orderItem));
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

      if (action === GenericAction.renewFioDomain) {
        await this.checkIfDomainOnOrderRegistered({
          orderItem,
          action: GenericAction.registerFioDomain,
          errorMessage: `RenewDomain has been canceled because domain - ${orderItem.domain} - from this order has not been registered`,
        });
      }

      result = await fioApi.executeAction({
        action,
        params: fioApi.getActionParams({
          ...orderItem,
          tpid:
            action === GenericAction.registerFioAddress ||
            action === GenericAction.registerFioDomain ||
            action === GenericAction.registerFioDomainAddress
              ? orderItem.affiliateTpid
              : orderItem.tpid,
          fee: await this.getFeeForAction(action),
          // Generate unique expirationOffset for actions that need to avoid duplicate transactions
          // Use hash-based approach to keep offsets within reasonable range (max 600 seconds = 10 minutes)
          expirationOffset:
            action === GenericAction.renewFioDomain ||
            action === GenericAction.addBundledTransactions
              ? generateUniqueExpirationOffset(orderItem.id)
              : 0,
        }),
        auth,
        returnBaseUrl: true,
        currentBaseUrl: orderItem.baseUrl,
      });

      // No tx id. Refund order payment for fio action.
      if (!result.transaction_id && !disableRefund)
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

      // For FIO payments, update payment total with actual fees from successful transactions
      try {
        const orderPayment = await Payment.getOrderPayment(orderId);
        if (orderPayment && orderPayment.processor === Payment.PROCESSOR.FIO) {
          await updateFioPaymentWithActualTotal(orderPayment.id);
        }
      } catch (actualTotalError) {
        logger.error(
          `FIO PAYMENT ACTUAL TOTAL UPDATE ERROR - ORDER ${orderId}`,
          actualTotalError,
        );
      }
    } catch (error) {
      logger.error(
        `ORDER ITEM PROCESSING ERROR - ORDER STATUS UPDATE - ${orderId}`,
        error,
      );
    }
  }

  /**
   * Group and sort order items for proper domain renewal sequencing
   */
  groupAndSortOrderItems(items) {
    // Group by domain and order
    const itemsByOrder = items.reduce((acc, item) => {
      if (!acc[item.orderId]) acc[item.orderId] = [];
      acc[item.orderId].push(item);
      return acc;
    }, {});

    // For each order, ensure domain registrations come before renewals
    Object.values(itemsByOrder).forEach(orderItems => {
      orderItems.sort((a, b) => {
        // Sort by priority: domain registration -> domain/address combo -> renewals -> others
        const getPriority = action => {
          switch (action) {
            case GenericAction.registerFioDomain:
              return 1;
            case GenericAction.registerFioDomainAddress:
              return 2;
            case GenericAction.renewFioDomain:
              return 3;
            default:
              return 4;
          }
        };

        const priorityA = getPriority(a.action);
        const priorityB = getPriority(b.action);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // If same priority, sort by domain to ensure consistency
        if (a.domain !== b.domain) {
          return a.domain.localeCompare(b.domain);
        }

        // Finally sort by creation time
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    });

    return itemsByOrder;
  }

  async execute() {
    await fioApi.getRawAbi();
    const roe = await getROE();
    const feesVar = await Var.getByKey(FEES_VAR_KEY);
    const prices = await fioApi.getPrices();
    const dashboardDomains = await Domain.getDashboardDomains();
    const allRefProfileDomains = await ReferrerProfile.getRefDomainsList();

    // Initialize fees using getAllFees with the already fetched feesVar
    const initialFees = await fioApi.getAllFees({ forceUpdate: false, feesVar });
    this.feesJson = initialFees || (feesVar ? JSON.parse(feesVar.value) : {});
    this.feesUpdatedAt = feesVar ? feesVar.updatedAt : null;

    const {
      addBundles: addBundlesPrice,
      address: addressPrice,
      domain: domainPrice,
      combo: domainAddressPrice,
      renewDomain: renewDomainPrice,
    } = prices;

    // get order items ready to process
    const items = await OrderItem.getActionRequired();

    this.postMessage(`Process order items - ${items.length}`);

    if (items.length === 0) {
      this.postMessage('No order items to process');
      this.finish();
      return;
    }

    const freeAndPaidFioAccountProfilesArr = await FioAccountProfile.getFreePaidItems();

    const { actor: paidFioActor, permission: paidFioPermision } =
      freeAndPaidFioAccountProfilesArr.find(
        fioAccountProfile => fioAccountProfile.accountType === FIO_ACCOUNT_TYPES.PAID,
      ) || {};
    const { actor: fallbackPaidFioActor, permission: fallbackPaidFioPermision } =
      freeAndPaidFioAccountProfilesArr.find(
        fioAccountProfile =>
          fioAccountProfile.accountType === FIO_ACCOUNT_TYPES.PAID_FALLBACK,
      ) || {};

    const { actor: freeFioActor, permission: freeFioPermission } =
      freeAndPaidFioAccountProfilesArr.find(
        fioAccountProfile => fioAccountProfile.accountType === FIO_ACCOUNT_TYPES.FREE,
      ) || {};
    const { actor: fallbackFreeFioActor, permission: fallbackFreeFioPermission } =
      freeAndPaidFioAccountProfilesArr.find(
        fioAccountProfile =>
          fioAccountProfile.accountType === FIO_ACCOUNT_TYPES.FREE_FALLBACK,
      ) || {};

    const processOrderItem = orderItem => async () => {
      if (this.isCancelled) return false;

      const {
        action,
        id,
        code,
        orderId,
        address,
        domain,
        data,
        price,
        blockchainTransactionId,
        label,
        nativeFio,
        freeActor,
        freePermission,
        paidActor,
        paidPermission,
      } = orderItem;

      const hasSignedTx = data && !!data.signedTx;

      this.postMessage(`Processing item id - ${id}`);

      try {
        if (
          (action === GenericAction.registerFioAddress ||
            action === GenericAction.registerFioDomainAddress) &&
          !(await fioApi.validateFioAddress(address, domain))
        ) {
          await this.handleFail(orderItem, NON_VALID_FCH, {
            errorType: ORDER_ERROR_TYPES.default,
          });
          return this.updateOrderStatus(orderId);
        }

        const fioName = fioApi.setFioName(address, domain);
        let auth = {
          actor: paidActor || paidFioActor,
          permission: paidPermission || paidFioPermision,
        };
        const freeAuth = {
          actor: freeActor || freeFioActor,
          permission: freePermission || freeFioPermission,
        };

        const domainOwner = await FioAccountProfile.getDomainOwner(domain);
        const useDomainOwnerAuthParams =
          domainOwner && action === GenericAction.registerFioAddress;

        if (useDomainOwnerAuthParams) {
          const { actor, permission } = domainOwner;
          auth = { actor, permission };
        }

        const domainExistingInDashboardDomains = dashboardDomains.find(
          dashboardDomain => dashboardDomain.name === domain,
        );

        const domainExistingInRefProfile = code
          ? allRefProfileDomains.find(
              refProfileDomain =>
                refProfileDomain.code === code && refProfileDomain.name === domain,
            )
          : null;

        const registeringDomainExistingInAppDomainsList =
          code && domainExistingInRefProfile
            ? domainExistingInRefProfile
            : domainExistingInDashboardDomains;
        this.postMessage(`PRICE:, ${price}`);
        this.postMessage(`!price || price === "0", ${!price || price === '0'}`);
        this.postMessage(
          `registeringDomainExistingInAppDomainsList,
          ${JSON.stringify(registeringDomainExistingInAppDomainsList, null, 4)}`,
        );
        this.postMessage(
          `action === GenericAction.registerFioAddress,
          ${action === GenericAction.registerFioAddress}`,
        );
        this.postMessage(`domainOwner, ${domainOwner}`);
        this.postMessage(`!domainOwner, ${!domainOwner}`);
        this.postMessage(`ORDER ITEM: ${JSON.stringify(orderItem)}`);
        // Handle free addresses
        if (
          (!price || price === '0') &&
          registeringDomainExistingInAppDomainsList &&
          !registeringDomainExistingInAppDomainsList.isPremium &&
          action === GenericAction.registerFioAddress &&
          !domainOwner
        ) {
          return this.registerFree({
            fioName,
            auth: freeAuth,
            orderItem,
            fallbackFreeFioActor,
            fallbackFreeFioPermission,
            registeringDomainExistingInAppDomainsList,
            processOrderItem,
            allRefProfileDomains,
          });
        }

        if (
          (!price || price === '0' || !nativeFio || nativeFio === '0') &&
          !domainOwner
        ) {
          let nativeFio = null;

          switch (action) {
            case GenericAction.registerFioDomainAddress:
              nativeFio = domainAddressPrice;
              break;
            case GenericAction.registerFioAddress:
              nativeFio = addressPrice;
              break;
            case GenericAction.addBundledTransactions:
              nativeFio = addBundlesPrice;
              break;
            case GenericAction.registerFioDomain:
              nativeFio = domainPrice;
              break;
            case GenericAction.renewFioDomain:
              nativeFio = renewDomainPrice;
              break;
            default:
              null;
          }
          const { usdc } = convertFioPrices(nativeFio, roe);

          if (!nativeFio)
            throw new Error('Item price should not be free. Updated prices failed.');

          orderItem.price = usdc;
          orderItem.nativeFio = nativeFio;

          await OrderItem.update({ price: usdc, nativeFio }, { where: { id } });
        }

        // Check if fee/roe changed and handle changes
        if (!useDomainOwnerAuthParams) await this.checkPriceChanges(orderItem, roe);

        let partnerDomainOwner = false;
        if (
          ((data && data.isNoProfileFlow) ||
            orderItem.userProfileType === User.USER_PROFILE_TYPE.ALTERNATIVE) &&
          domainOwner &&
          [METAMASK_DOMAIN_NAME].includes(domain)
        ) {
          const userHasFreeAddressOnPublicKey = await FreeAddress.getItems({
            freeId: orderItem.freeId,
          });

          const existingUsersFreeAddress =
            userHasFreeAddressOnPublicKey &&
            userHasFreeAddressOnPublicKey.find(
              freeAddress => freeAddress.name.split(FIO_ADDRESS_DELIMITER)[1] === domain,
            );

          if (
            userHasFreeAddressOnPublicKey &&
            userHasFreeAddressOnPublicKey.length &&
            existingUsersFreeAddress
          ) {
            logger.error(USER_HAS_FREE_ERROR);

            await this.handleFail(orderItem, USER_HAS_FREE_ERROR, {
              errorType: ORDER_ERROR_TYPES.userHasFreeAddress,
            });
            return this.updateOrderStatus(orderId);
          }

          partnerDomainOwner = true;
        }

        if (
          orderItem.processor === Payment.PROCESSOR.FIO &&
          !hasSignedTx &&
          !domainOwner
        ) {
          logger.error(NO_REQUIRED_SIGNED_TX);

          await this.handleFail(orderItem, NO_REQUIRED_SIGNED_TX, {
            errorType: ORDER_ERROR_TYPES.noSignedTxProvided,
          });
          return this.updateOrderStatus(orderId);
        }

        try {
          const result = await this.executeOrderItemAction(
            orderItem,
            auth,
            hasSignedTx,
            useDomainOwnerAuthParams,
          );

          if (result.transaction_id) {
            this.postMessage(
              `Processing item transactions created - ${id} / ${result.transaction_id}`,
            );
            await OrderItem.setPending(result, id, blockchainTransactionId);

            if (partnerDomainOwner) {
              const freeAddressRecord = new FreeAddress({
                name: fioName,
                freeId: orderItem.freeId,
              });
              await freeAddressRecord.save();
            }

            return this.updateOrderStatus(orderId);
          }

          // transaction failed
          const { notes, code, data: errorData } = fioApi.checkTxError(result);

          // try to execute using fallback account when no funds
          if (
            (notes === INSUFFICIENT_FUNDS_ERR_MESSAGE ||
              notes === INSUFFICIENT_BALANCE) &&
            auth.actor !== fallbackPaidFioActor
          ) {
            await sendInsufficientFundsNotification(fioName, label, auth);

            if (!useDomainOwnerAuthParams)
              return processOrderItem({
                ...orderItem,
                paidActor: fallbackPaidFioActor
                  ? fallbackPaidFioActor
                  : process.env.REG_FALLBACK_ACCOUNT,
                paidPermission: fallbackPaidFioPermision
                  ? fallbackPaidFioPermision
                  : process.env.REG_FALLBACK_PERMISSION,
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

    // Group and sort items for proper sequencing
    const itemsByOrder = this.groupAndSortOrderItems(items);

    // Convert to array of methods grouped by order
    const methodsByOrder = Object.values(itemsByOrder).map(orderItems =>
      orderItems.map(item => processOrderItem(item)),
    );

    // Process orders in chunks for better performance and enable non-blocking execution
    const totalOrders = methodsByOrder.length;
    this.postMessage(
      `Processing ${totalOrders} orders in chunks of ${CHUNK_SIZE} with max ${MAX_CONCURRENT_CHUNKS} concurrent chunks`,
    );

    // Create chunks
    const chunks = [];
    for (let i = 0; i < methodsByOrder.length; i += CHUNK_SIZE) {
      chunks.push({
        orders: methodsByOrder.slice(i, i + CHUNK_SIZE),
        chunkNumber: Math.floor(i / CHUNK_SIZE) + 1,
      });
    }

    const totalChunks = chunks.length;
    let processedChunks = 0;

    // Process chunks with controlled concurrency
    const processChunk = async chunkData => {
      const { orders: chunk, chunkNumber } = chunkData;

      // Check if job has been cancelled
      if (this.isCancelled) {
        this.postMessage(`Job cancelled during chunk ${chunkNumber} processing`);
        return false;
      }

      this.postMessage(
        `Processing chunk ${chunkNumber}/${totalChunks} (${
          chunk.length
        } orders, ${chunk.reduce(
          (sum, orderMethods) => sum + orderMethods.length,
          0,
        )} items)`,
      );

      // Process each order in the chunk - orders can run in parallel, items within an order run by priority groups

      const results = await Promise.allSettled(
        chunk.map(async orderMethods => {
          // Items are already sorted by priority (domain reg -> combo -> renewal -> others) by groupAndSortOrderItems
          // We need to process in priority groups: dependencies first, then parallel processing of safe items

          // Since items are pre-sorted, we can process them in two phases:
          // Phase 1: Process critical dependencies (domain registrations) sequentially
          // Phase 2: Process safe items (renewals, etc.) in parallel

          let dependencyPhaseComplete = false;
          let currentIndex = 0;

          // Phase 1: Process dependency items sequentially until we hit safe-to-parallelize items
          while (currentIndex < orderMethods.length && !dependencyPhaseComplete) {
            if (this.isCancelled) return false;

            // Assume first few items need sequential processing (domain registrations, combos)
            // After dependencies are met, remaining items can run in parallel
            const isLikelyDependency = currentIndex < Math.min(2, orderMethods.length);

            if (isLikelyDependency) {
              try {
                await orderMethods[currentIndex]();
              } catch (e) {
                // Individual item errors are already logged, continue with next item
              }
              currentIndex++;
            } else {
              dependencyPhaseComplete = true;
            }
          }

          // Phase 2: Process remaining items (renewals, etc.) in parallel with staggered timing
          if (currentIndex < orderMethods.length) {
            const remainingMethods = orderMethods.slice(currentIndex);

            await Promise.allSettled(
              remainingMethods.map(async (method, index) => {
                if (this.isCancelled) return false;

                // Add small staggered delay to prevent identical concurrent transactions
                // This ensures even identical actions get slightly different timestamps
                if (index > 0) {
                  await new Promise(resolve => setTimeout(resolve, index * 5)); // 5ms stagger
                }

                try {
                  await method();
                } catch (e) {
                  // Individual item errors are already logged, continue with next item
                }
              }),
            );
          }
        }),
      );

      // Log any order-level failures for monitoring
      const failedOrders = results.filter(result => result.status === 'rejected');
      if (failedOrders.length > 0) {
        this.postMessage(
          `Chunk ${chunkNumber}: ${failedOrders.length} orders failed at order level`,
        );
        failedOrders.forEach(failure => {
          logger.error(
            `Order processing failed in chunk ${chunkNumber}:`,
            failure.reason,
          );
        });
      }

      processedChunks++;
      this.postMessage(
        `Completed chunk ${chunkNumber}/${totalChunks} (${processedChunks} total completed)`,
      );

      return true;
    };

    // Process chunks with concurrency limit
    const semaphore = [];
    const chunkPromises = chunks.map(async chunkData => {
      // Wait for an available slot
      while (semaphore.length >= MAX_CONCURRENT_CHUNKS) {
        await Promise.race(semaphore);
      }

      // Add this chunk to the semaphore
      const chunkPromise = processChunk(chunkData);
      semaphore.push(chunkPromise);

      try {
        const result = await chunkPromise;
        return result;
      } finally {
        // Remove from semaphore when done
        const index = semaphore.indexOf(chunkPromise);
        if (index > -1) {
          semaphore.splice(index, 1);
        }
      }
    });

    // Wait for all chunks to complete
    await Promise.allSettled(chunkPromises);

    this.postMessage('All order items processed successfully');
    this.finish();
  }
}

new OrdersJob().execute();
