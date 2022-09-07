import { BlockchainTransaction, Notification, Order, Payment, Wallet } from '../models';

import { fioApi } from '../external/fio.mjs';
import MathOp from './math.mjs';
import logger from '../logger.mjs';

export const updateOrderStatus = async (orderId, paymentStatus, txStatuses, t) => {
  await Order.updateStatus(orderId, paymentStatus, txStatuses, t);

  const order = await Order.orderInfo(orderId);

  if (order) {
    const orderHasCompletedStatus =
      order.status === Order.STATUS.FAILED ||
      order.status === Order.STATUS.PARTIALLY_SUCCESS ||
      order.status === Order.STATUS.SUCCESS;

    const orderHasNotification = await Notification.findOne({
      where: {
        contentType: Notification.CONTENT_TYPE.PURCHASE_CONFIRMATION,
        data: {
          emailData: {
            orderNumber: order.number,
          },
        },
      },
    });

    if (orderHasCompletedStatus && !orderHasNotification) {
      createPurchaseConfirmationNotification(order);
    }
  }
};

const countTotalPriceAmount = orderItems =>
  orderItems.reduce(
    ({ fioNativeTotal, priceTotal }, orderItem) => {
      fioNativeTotal += new MathOp(fioNativeTotal).add(orderItem.nativeFio).toNumber();
      priceTotal += new MathOp(priceTotal).add(orderItem.price).toNumber();

      return { fioNativeTotal, priceTotal };
    },
    { fioNativeTotal: 0, priceTotal: 0 },
  );

const transformFioPrice = (usdcPrice, nativeAmount) => {
  if (!usdcPrice && !nativeAmount) return 'FREE';
  return `${usdcPrice} USDC (${fioApi.sufToAmount(nativeAmount).toFixed(2)}) FIO`;
};

const transformOrderItemsForEmail = (orderItems, showPriceWithFioAmount) =>
  orderItems.map(orderItem => {
    const { address, data, domain, nativeFio, price } = orderItem;
    let priceAmount = {};

    if (price && price !== '0') {
      if (showPriceWithFioAmount) {
        priceAmount = transformFioPrice(price, nativeFio);
      } else {
        priceAmount = `${price} USDC`;
      }
    } else {
      priceAmount = 'FREE';
    }

    const transformedOrderItem = { address, domain, priceAmount };
    if (data && data.hasCustomDomain)
      transformedOrderItem.hasCustomDomain = data.hasCustomDomain;

    return transformedOrderItem;
  });

const getFioWalletName = async (publicKey, userId) => {
  const wallet = await Wallet.findOne({
    where: { publicKey, userId },
  });
  return wallet.name || 'N/A';
};

const getCreditCardName = creditCardData => {
  const { payment_method_details: { card: { brand, last4 } = {} } = {} } =
    creditCardData || {};
  return brand && last4 ? `${brand.toUpperCase()} ending in ${last4}` : 'N/A';
};

const getPaidWith = async ({ isCreditCardProcessor, publicKey, userId, payment }) => {
  if (isCreditCardProcessor) {
    const { data: paymentData = {} } = payment;

    const {
      webhookData: { charges: { data: creditCardData = [] } = {} } = {},
    } = paymentData;

    return getCreditCardName(creditCardData[0]);
  }

  return await getFioWalletName(publicKey, userId);
};

const handleOrderPaymentInfo = async ({ orderItems, payment, paidWith }) => {
  if (!orderItems.length) return {};

  const { data: paymentData, processor } = payment;

  const orderPaymentInfo = {};

  const isCreditCardProcessor = processor === Payment.PROCESSOR.CREDIT_CARD;
  const isFioProcessor = processor === Payment.PROCESSOR.FIO;

  const orderItemsTotalAmount = countTotalPriceAmount(orderItems);

  if (isFioProcessor) {
    orderPaymentInfo.paidWith = paidWith;
    orderPaymentInfo.txIds = [];
    orderPaymentInfo.total = transformFioPrice(
      orderItemsTotalAmount.priceTotal,
      orderItemsTotalAmount.fioNativeTotal,
    );

    // we need to get all blockchain transactions that have ids
    orderItems.forEach(orderItem => {
      orderItem.blockchainTransactions.forEach(
        bcTx => bcTx.txId && orderPaymentInfo.txIds.push(bcTx.txId),
      );
    });

    // if we have one txId item we set it as txId instead of txIds array, we need it for email template render
    if (orderPaymentInfo.txIds.length === 1) {
      orderPaymentInfo.txId = orderPaymentInfo.txIds[0];
      orderPaymentInfo.txIds = [];
    }
  }

  if (isCreditCardProcessor && paymentData) {
    const { webhookData: { txn_id } = {} } = paymentData;

    orderPaymentInfo.paidWith = paidWith;
    orderPaymentInfo.txId = txn_id;
    orderPaymentInfo.total = `${orderItemsTotalAmount.priceTotal} USDC`;
  }

  return orderPaymentInfo;
};

const handleOrderError = ({ status, price, isCreditCardProcessor }) => {
  const isPartialStatus = status === Order.STATUS.PARTIALLY_SUCCESS;

  let message =
    'Your purchase was not completed in full. Please see below what failed to be completed.';

  if (isCreditCardProcessor) {
    message = `There was an error during registration. As a result we have refunded the entire amount of order, $${price} back to your credit card. Try purchasing again.`;

    if (isPartialStatus) {
      message = `The following items failed to purchase. As a result we have refunded $${price} back to your credit card. Try purchasing again.`;
    }
  }
  return { title: 'Incomplete Purchase!', message };
};

const createPurchaseConfirmationNotification = async order => {
  try {
    const {
      items,
      number,
      payments,
      publicKey,
      status,
      user: { id: userId },
    } = order;
    const payment =
      payments.find(payment => payment.spentType === Payment.SPENT_TYPE.ORDER) || {};

    const isCreditCardProcessor = payment.processor === Payment.PROCESSOR.CREDIT_CARD;
    const isFioProcessor = payment.processor === Payment.PROCESSOR.FIO;

    const successedOrderItemsArr = items.filter(
      orderItem =>
        orderItem.orderItemStatus.txStatus === BlockchainTransaction.STATUS.SUCCESS,
    );
    const failedOrderItemsArr = items.filter(
      orderItem =>
        orderItem.orderItemStatus.txStatus === BlockchainTransaction.STATUS.FAILED,
    );

    const successedOrderItems = transformOrderItemsForEmail(
      successedOrderItemsArr,
      isFioProcessor,
    );
    const failedOrderItems = transformOrderItemsForEmail(
      failedOrderItemsArr,
      isFioProcessor,
    );

    const paidWith = await getPaidWith({
      isCreditCardProcessor,
      publicKey,
      userId,
      payment,
    });

    const successedOrderPaymentInfo = await handleOrderPaymentInfo({
      orderItems: successedOrderItemsArr,
      payment,
      paidWith,
    });
    const failedOrderPaymentInfo = await handleOrderPaymentInfo({
      orderItems: failedOrderItemsArr,
      payment,
      paidWith,
    });

    const error = {};
    if (failedOrderItemsArr.length) {
      const { priceTotal } = countTotalPriceAmount(failedOrderItemsArr);
      const { title, message } = handleOrderError({
        status,
        price: priceTotal,
        isCreditCardProcessor,
      });
      error.title = title;
      error.message = message;
    }

    await Notification.create({
      type: Notification.TYPE.INFO,
      contentType: Notification.CONTENT_TYPE.PURCHASE_CONFIRMATION,
      userId: userId,
      data: {
        emailData: {
          orderNumber: number,
          successedOrderItems,
          successedOrderPaymentInfo,
          failedOrderItems,
          failedOrderPaymentInfo,
          error,
          date: new Date(),
        },
      },
    });
  } catch (e) {
    logger.error(
      `Purchase Confirmation create notification error ${e.message}. Order #${order.number}`,
    );
  }
};
