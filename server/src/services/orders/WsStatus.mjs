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
    try {
      const { id: orderId } =
        (await Order.findOne({ where: { number: orderNumber } })) || {};

      if (!orderId)
        throw new Error(`Can't find order id for order number ${orderNumber}`);
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
            this.messageData.results = order;
          } catch (e) {
            logger.error(`WS ERROR. Order items set. ${orderId}. ${e}`);
          }

          const data = JSON.stringify({
            data: this.messageData,
          });

          delete data.data;
          delete data.user;

          this.send(data);
        }
      } catch (e) {
        logger.error(`WS ERROR. Order status. ${orderId}. ${e}`);
      }
    } catch (e) {
      logger.error(`WS ERROR. Order items get. ${e}`);
    }
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return [];
  }
}
