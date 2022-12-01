import { BlockchainTransaction, Notification, Order, Payment } from '../models';

import { fioApi } from '../external/fio.mjs';
import { countTotalPriceAmount, getPaidWith } from '../utils/order.mjs';
import MathOp from './math.mjs';
import logger from '../logger.mjs';
import { FIO_ACTIONS_LABEL, FIO_ACTIONS } from '../config/constants.js';

export const checkOrderStatusAndCreateNotification = async orderId => {
  const order = await Order.orderInfo(orderId);

  if (
    order &&
    (order.status === Order.STATUS.PARTIALLY_SUCCESS ||
      order.status === Order.STATUS.SUCCESS)
  ) {
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

    if (!orderHasNotification) {
      await createPurchaseConfirmationNotification(order);
    }
  }
};

export const updateOrderStatus = async (orderId, paymentStatus, txStatuses, t) => {
  await Order.updateStatus(orderId, paymentStatus, txStatuses, t);
  await checkOrderStatusAndCreateNotification(orderId);
};

const transformFioPrice = (usdcPrice, nativeAmount) => {
  if (!usdcPrice && !nativeAmount) return 'FREE';
  return `${new MathOp(usdcPrice).toNumber().toFixed(2)} USDC (${fioApi
    .sufToAmount(nativeAmount)
    .toFixed(2)}) FIO`;
};

const transformOrderItemsForEmail = (orderItems, showPriceWithFioAmount) =>
  orderItems.map(orderItem => {
    const { action, address, data, domain, nativeFio, price } = orderItem;
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

    const transformedOrderItem = {
      descriptor: FIO_ACTIONS_LABEL[action],
      address,
      domain,
      priceAmount,
    };
    if (data && data.hasCustomDomain) {
      transformedOrderItem.hasCustomDomain = data.hasCustomDomain;
      transformedOrderItem.descriptor =
        FIO_ACTIONS_LABEL[
          `${FIO_ACTIONS.registerFioAddress}_${FIO_ACTIONS.registerFioDomain}`
        ];
    }

    return transformedOrderItem;
  });

const handleOrderPaymentInfo = async ({ orderItems, payment, paidWith, number }) => {
  if (!orderItems.length) return {};

  const { data: paymentData, processor } = payment;

  const orderPaymentInfo = {};

  const isCreditCardProcessor = processor === Payment.PROCESSOR.STRIPE;
  const isFioProcessor = processor === Payment.PROCESSOR.FIO;

  const orderItemsTotalAmount = countTotalPriceAmount(orderItems);

  if (isFioProcessor) {
    orderPaymentInfo.paidWith = paidWith;
    orderPaymentInfo.txIds = [];
    orderPaymentInfo.total = transformFioPrice(
      orderItemsTotalAmount.usdcTotal,
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
    orderPaymentInfo.paidWith = paidWith;
    orderPaymentInfo.orderNumber = number;
    orderPaymentInfo.total = `${orderItemsTotalAmount.usdcTotal.toFixed(2)} USDC`;
  }

  return orderPaymentInfo;
};

const createPurchaseConfirmationNotification = async order => {
  try {
    const {
      items,
      number,
      payments,
      publicKey,
      user: { id: userId },
    } = order;
    const payment =
      payments.find(payment => payment.spentType === Payment.SPENT_TYPE.ORDER) || {};

    const isCreditCardProcessor = payment.processor === Payment.PROCESSOR.STRIPE;
    const isFioProcessor = payment.processor === Payment.PROCESSOR.FIO;

    const successedOrderItemsArr = items.filter(
      orderItem =>
        orderItem.orderItemStatus.txStatus === BlockchainTransaction.STATUS.SUCCESS,
    );

    const successedOrderItems = transformOrderItemsForEmail(
      successedOrderItemsArr,
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
      number,
    });

    await Notification.create({
      type: Notification.TYPE.INFO,
      contentType: Notification.CONTENT_TYPE.PURCHASE_CONFIRMATION,
      userId: userId,
      data: {
        emailData: {
          orderNumber: number,
          successedOrderItems,
          successedOrderPaymentInfo,
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
