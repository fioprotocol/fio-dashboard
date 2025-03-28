import { GenericAction } from '@fioprotocol/fiosdk';

import {
  BlockchainTransaction,
  Notification,
  Order,
  Payment,
  User,
  OrderItem,
  OrderItemStatus,
} from '../models';

import { fioApi } from '../external/fio.mjs';
import { sendGTMEvent } from '../external/googleapi.mjs';
import { sendSendinblueEvent } from './external/SendinblueEvent.mjs';

import { countTotalPriceAmount, getPaidWith } from '../utils/order.mjs';
import MathOp from './math.mjs';
import logger from '../logger.mjs';

import {
  ANALYTICS_EVENT_ACTIONS,
  FIO_ACTIONS_LABEL,
  FIO_ACTIONS_WITH_PERIOD,
  FIO_ACTIONS_COMBO,
} from '../config/constants.js';

export const checkOrderStatusAndCreateNotification = async orderId => {
  const order = await Order.findByPk(orderId, {
    include: [User],
  });

  if (
    order &&
    (order.status === Order.STATUS.PARTIALLY_SUCCESS ||
      order.status === Order.STATUS.SUCCESS)
  ) {
    let orderData = order.get({ plain: true });

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
      const resData = await createPurchaseConfirmationNotification(Order.format(order));
      orderData = { ...orderData, ...resData };
    }

    return orderData;
  }

  return null;
};

const sendAnalytics = async (orderData = null) => {
  if (!orderData) return;
  if (!orderData.payment) {
    orderData.payment = (await Payment.getOrderPayment(orderData.id)).get({
      plain: true,
    });
  }
  if (!orderData.succeedItems) {
    orderData.succeedItems = (
      await OrderItem.findAll({
        where: { orderId: orderData.id },
        include: [
          {
            model: OrderItemStatus,
            where: { txStatus: BlockchainTransaction.STATUS.SUCCESS },
            required: true,
          },
          BlockchainTransaction,
        ],
      })
    ).map(item => item.get({ plain: true }));
  }

  const { payment, succeedItems, user, ...rest } = orderData;
  const orderFormatted = await Order.formatDetailed({
    ...rest,
    Payments: [payment],
    OrderItems: succeedItems,
    User: user,
  });

  const isSuccess = orderFormatted.status === Order.STATUS.SUCCESS;
  const isPartial = orderFormatted.status === Order.STATUS.PARTIALLY_SUCCESS;
  const isFailed = orderFormatted.status === Order.STATUS.FAILED;

  if (isSuccess || isPartial || isFailed) {
    const { payment, regItems, total, data: orderData } = orderFormatted;
    const { gaClientId, gaSessionId } = orderData || {};

    const data = {
      currency: Payment.CURRENCY.USDC,
      payment_type: total === '0' ? 'free' : payment.paymentProcessor,
    };

    let analyticsEvent = '';

    if (isSuccess || isPartial) {
      data.items = regItems.map(regItem => ({
        item_name: regItem.type,
        price: new MathOp(regItem.costUsdc).toNumber(),
      }));
      data.value = new MathOp(payment.regTotalCost.usdcTotal).toNumber();
    }

    if (isSuccess) {
      analyticsEvent = ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED;
    }
    if (isPartial) {
      analyticsEvent = ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED_PARTIAL;
    }
    if (isFailed) {
      analyticsEvent = ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED_FAILED;
    }

    await sendGTMEvent({
      event: analyticsEvent,
      clientId: gaClientId,
      data,
      sessionId: gaSessionId,
    });
    user && (await sendSendinblueEvent({ event: analyticsEvent, user }));
  }
};

export const updateOrderStatus = async (orderId, paymentStatus, txStatuses, t) => {
  await Order.updateStatus(orderId, paymentStatus, txStatuses, t);
  const orderData = await checkOrderStatusAndCreateNotification(orderId);
  await sendAnalytics(orderData);
};

const transformFioPrice = (usdcPrice, nativeAmount) => {
  if (!usdcPrice && !nativeAmount) return 'FREE';
  return `$${new MathOp(usdcPrice).round(2, 1).toString()} (${fioApi.sufToAmount(
    nativeAmount || 0,
  )}) FIO`;
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
        existsItem.action = GenericAction.registerFioAddress;
        existsItem.data.hasCustomDomain = true;
        existsItem.nativeFio = new MathOp(existsItem.nativeFio)
          .add(item.nativeFio)
          .toString();
        existsItem.price = new MathOp(existsItem.price).add(item.price).toString();
      } else if (FIO_ACTIONS_WITH_PERIOD.includes(item.action) && existsItem) {
        existsItem.period++;
        existsItem.blockchainTransactions = [
          ...(existsItem.blockchainTransactions || []),
          ...(item.blockchainTransactions || []),
        ];
        existsItem.nativeFio = new MathOp(existsItem.nativeFio)
          .add(item.nativeFio)
          .toString();
        existsItem.price = new MathOp(existsItem.price).add(item.price).toString();
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
      let priceAmount;

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
            `${GenericAction.registerFioAddress}_${GenericAction.registerFioDomain}`
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
      number,
      publicKey,
      user: { id: userId, email },
    } = order;

    if (!email || !userId) return; // Do not create notification if user has no email. For example it could be MetaMask user.

    const succeedItems = (
      await OrderItem.findAll({
        where: { orderId: order.id },
        include: [
          {
            model: OrderItemStatus,
            where: { txStatus: BlockchainTransaction.STATUS.SUCCESS },
            required: true,
          },
          BlockchainTransaction,
        ],
      })
    ).map(item => item.get({ plain: true }));
    const payment = (await Payment.getOrderPayment(order.id)).get({
      plain: true,
    });
    const succeedItemsFormatted = succeedItems.map(item => OrderItem.format(item));
    const paymentFormatted = Payment.format(payment);

    const succeedOrderItems = transformOrderItemsForEmail(succeedItemsFormatted);

    const paidWith = await getPaidWith({
      paymentProcessor: paymentFormatted.processor,
      publicKey,
      userId,
      payment: paymentFormatted,
    });

    const succeedOrderPaymentInfo = await handleOrderPaymentInfo({
      orderItems: succeedItemsFormatted,
      payment: paymentFormatted,
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
          successedOrderItems: succeedOrderItems,
          successedOrderPaymentInfo: succeedOrderPaymentInfo,
          date: new Date(),
        },
      },
    });

    return {
      payment,
      succeedItems,
    };
  } catch (e) {
    logger.error(
      `Purchase Confirmation create notification error ${e.message}. Order #${order.number}`,
    );
  }
};
