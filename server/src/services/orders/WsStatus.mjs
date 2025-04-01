import Sequelize from 'sequelize';

import WsBase from '../WsBase';

import {
  Order,
  OrderItemStatus,
  Payment,
  BlockchainTransaction,
  User,
} from '../../models';

import BitPay from '../../external/payment-processor/bitpay.mjs';

import logger from '../../logger.mjs';

export default class WsStatus extends WsBase {
  constructor(args) {
    super(args);

    this.WAIT_PERIOD_MS = 3000;
    this.messageData = {
      orderStatus: 0,
      paymentStatus: 0,
    };
  }

  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            orderNumber: 'string',
          },
        },
      ],
    };
  }

  async watch({ data: { orderNumber } }) {
    const userId = this.context.id;

    const where = {
      number: orderNumber,
    };

    const userWhere = {
      userProfileType: {
        [Sequelize.Op.not]: User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION,
      },
    };
    if (userId) {
      where.userId = userId;
      userWhere.id = userId;
    }

    // do not get orders created by primary|alternate users
    if (!userId) {
      userWhere.userProfileType = User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION;
    }

    try {
      const { id: orderId } =
        (await Order.findOne({
          raw: true,
          where,
          include: [{ model: User, where: userWhere, required: true }],
        })) || {};

      if (!orderId) {
        logger.error(
          `WS ERROR. Order status. Can't find order id for order number ${orderNumber}.`,
        );
        this.send(JSON.stringify({ error: 'NOT_FOUND' }));
        return this.onClose();
      }

      // Update Order status
      try {
        const items = await OrderItemStatus.getAllItemsStatuses(orderId);

        await Order.updateStatus(
          orderId,
          null,
          items
            .filter(({ txStatus }) => txStatus !== BlockchainTransaction.STATUS.NONE)
            .map(({ txStatus }) => txStatus),
        );
      } catch (error) {
        logger.error(`ORDER STATUS UPDATE - ${orderId}`, error);
      }

      const order = await Order.orderInfo(orderId, {
        useFormatDetailed: true,
        onlyOrderPayment: true,
        orderWhere: where,
        userWhere,
      });

      try {
        if (
          this.messageData.orderStatus !== order.status ||
          this.messageData.paymentStatus !== order.payment.paymentStatus
        ) {
          this.messageData.orderStatus = order.status;
          this.messageData.paymentStatus = order.payment.paymentStatus;

          try {
            if (
              order.payment.paymentProcessor === Payment.PROCESSOR.BITPAY &&
              order.status === Order.STATUS.NEW &&
              order.payment.paymentData &&
              order.payment.paymentData.webhookData
            ) {
              await BitPay.getInvoiceWebHook(order.payment.paymentData.webhookData.id);
            }
            this.messageData.results = order;

            delete this.messageData.results.data;
            delete this.messageData.results.user;
            if (this.messageData.results.payment) {
              delete this.messageData.results.payment.paymentData;
            }
          } catch (e) {
            logger.error(`WS ERROR. Order items set. ${orderId}. ${e}`);
          }

          const data = JSON.stringify({
            data: this.messageData,
          });

          this.send(data);
        }
      } catch (e) {
        logger.error(`WS ERROR. Order status. ${orderId}. ${e}`);
      }
    } catch (e) {
      logger.error(`WS ERROR. Order items get. ${e}`);
      return this.onError();
    }
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return [];
  }
}
