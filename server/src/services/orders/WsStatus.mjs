import WsBase from '../WsBase';

import { Order, OrderItemStatus, Payment, BlockchainTransaction } from '../../models';

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
    const guestId = this.context.guestId;

    const where = {
      number: orderNumber,
    };

    // Logged-in user: authorize by userId
    // Guest (no-profile flow): authorize by guestId
    if (userId) {
      where.userId = userId;
    } else if (guestId) {
      where.guestId = guestId;
    } else {
      logger.error('WS ERROR. Order status. No userId or guestId in context.');
      this.send(JSON.stringify({ error: 'PERMISSION_DENIED' }));
      this.CLOSED = true;
      this.wsConnection.isAlive = false;
      this.wsConnection.close();
      return;
    }

    try {
      const { id: orderId } =
        (await Order.findOne({
          raw: true,
          where,
        })) || {};

      if (!orderId) {
        logger.error(
          `WS ERROR. Order status. Can't find order id for order number ${orderNumber}.`,
        );
        this.send(JSON.stringify({ error: 'NOT_FOUND' }));
        this.CLOSED = true;
        this.wsConnection.isAlive = false;
        this.wsConnection.close();
        return;
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

            if (order.payment) {
              delete order.payment.paymentData;
            }

            // Never expose guestId to the client
            delete order.guestId;

            this.messageData.results = order;
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
