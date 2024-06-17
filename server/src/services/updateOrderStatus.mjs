import { BlockchainTransaction, Notification, Order, Payment, User } from '../models';

import { fioApi } from '../external/fio.mjs';
import { sendGTMEvent } from '../external/googleapi.mjs';
import { sendSendinblueEvent } from './external/SendinblueEvent.mjs';

import { countTotalPriceAmount, getPaidWith } from '../utils/order.mjs';
import MathOp from './math.mjs';
import logger from '../logger.mjs';

import {
  ANALYTICS_EVENT_ACTIONS,
  FIO_ACTIONS_LABEL,
  FIO_ACTIONS,
  FIO_ACTIONS_WITH_PERIOD,
  FIO_ACTIONS_COMBO,
} from '../config/constants.js';

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

const sendAnalytics = async orderId => {
  const order = await Order.orderInfo(orderId, true);

  const isSuccess = order && order.status === Order.STATUS.SUCCESS;
  const isPartial = order && order.status === Order.STATUS.PARTIALLY_SUCCESS;
  const isFailed = order && order.status === Order.STATUS.FAILED;

  if (isSuccess || isPartial || isFailed) {
    const user = await User.findActive(order.user && order.user.id);

    const { payment, regItems, total, data: orderData } = order;
    const { gaClientId, gaSessionId } = orderData || {};

    const data = {
      currency: Payment.CURRENCY.USDC,
      payment_type: total === '0' ? 'free' : payment.paymentProcessor,
    };

    let anayticsEvent = '';

    if (isSuccess || isPartial) {
      data.items = regItems.map(regItem => ({
        item_name: regItem.type,
        price: Number(regItem.costUsdc),
      }));
      data.value = Number(payment.regTotalCost.usdcTotal);
    }

    if (isSuccess) {
      anayticsEvent = ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED;
    }
    if (isPartial) {
      anayticsEvent = ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED_PARTIAL;
    }
    if (isFailed) {
      anayticsEvent = ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED_FAILED;
    }

    await sendGTMEvent({
      event: anayticsEvent,
      clientId: gaClientId,
      data,
      sessionId: gaSessionId,
    });
    user && (await sendSendinblueEvent({ event: anayticsEvent, user }));
  }
};

export const updateOrderStatus = async (orderId, paymentStatus, txStatuses, t) => {
  await Order.updateStatus(orderId, paymentStatus, txStatuses, t);
  await checkOrderStatusAndCreateNotification(orderId);
  await sendAnalytics(orderId);
};

const transformFioPrice = (usdcPrice, nativeAmount) => {
  if (!usdcPrice && !nativeAmount) return 'FREE';
  return `$${new MathOp(usdcPrice).toNumber().toFixed(2)} (${fioApi
    .sufToAmount(nativeAmount)
    .toFixed(2)}) FIO`;
};

const transformOrderItemsForEmail = orderItems =>
  orderItems
    .reduce((items, item) => {
      const existsItem = items.find(
        orderItem =>
          orderItem.data &&
          item.data &&
          orderItem.data.cartItemId === item.data.cartItemId,
      );
      if (
        existsItem &&
        item.action !== existsItem.action &&
        FIO_ACTIONS_COMBO.includes(item.action) &&
        FIO_ACTIONS_COMBO.includes(existsItem.action)
      ) {
        if (!existsItem.address) {
          existsItem.address = item.address;
        }
        existsItem.action = FIO_ACTIONS.registerFioAddress;
        existsItem.data.hasCustomDomain = true;
        existsItem.nativeFio = new MathOp(existsItem.nativeFio)
          .add(item.nativeFio)
          .toNumber();
        existsItem.price = new MathOp(existsItem.price).add(item.price).toNumber();
      } else if (FIO_ACTIONS_WITH_PERIOD.includes(item.action) && existsItem) {
        existsItem.period++;
        existsItem.blockchainTransactions = [
          ...(existsItem.blockchainTransactions || []),
          ...(item.blockchainTransactions || []),
        ];
        existsItem.nativeFio = new MathOp(existsItem.nativeFio)
          .add(item.nativeFio)
          .toNumber();
        existsItem.price = new MathOp(existsItem.price).add(item.price).toNumber();
      } else {
        if (FIO_ACTIONS_WITH_PERIOD.includes(item.action)) {
          item.period = 1;
        }
        items.push({
          ...item,
        });
      }

      return items;
    }, [])
    .map(orderItem => {
      const { action, address, data, domain, nativeFio, price } = orderItem;
      let priceAmount = {};

      if (price && price !== '0') {
        priceAmount = transformFioPrice(price, nativeFio);
      } else {
        priceAmount = 'FREE';
      }

      const transformedOrderItem = {
        descriptor: FIO_ACTIONS_LABEL[action],
        address,
        domain,
        priceAmount,
      };
      if (orderItem.period) {
        transformedOrderItem.descriptor = `${transformedOrderItem.descriptor} - ${
          orderItem.period
        } year${orderItem.period > 1 ? 's' : ''}`;
      }
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

  const orderPaymentInfo = {
    paidWithTitle: 'Paid With',
  };

  const isExternalProcessor = [
    Payment.PROCESSOR.STRIPE,
    Payment.PROCESSOR.BITPAY,
  ].includes(processor);
  const isFioProcessor = processor === Payment.PROCESSOR.FIO;

  const orderItemsTotalAmount = countTotalPriceAmount(orderItems);

  orderPaymentInfo.total = transformFioPrice(
    orderItemsTotalAmount.usdcTotal,
    orderItemsTotalAmount.fioNativeTotal,
  );

  if (isFioProcessor) {
    orderPaymentInfo.paidWith = paidWith;
    orderPaymentInfo.txIds = [];
    if (orderPaymentInfo.total === 'FREE') orderPaymentInfo.paidWithTitle = 'Assigned To';

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

  if (isExternalProcessor && paymentData) {
    orderPaymentInfo.paidWith = paidWith;
    orderPaymentInfo.orderNumber = number;
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
      user: { id: userId, email },
    } = order;

    if (!email) return; // Do not create notification if user has no email. For example it could be MetaMask user.

    const payment =
      payments.find(payment => payment.spentType === Payment.SPENT_TYPE.ORDER) || {};

    const successedOrderItemsArr = items.filter(
      orderItem =>
        orderItem.orderItemStatus.txStatus === BlockchainTransaction.STATUS.SUCCESS,
    );

    const successedOrderItems = transformOrderItemsForEmail(successedOrderItemsArr);

    const paidWith = await getPaidWith({
      paymentProcessor: payment.processor,
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
