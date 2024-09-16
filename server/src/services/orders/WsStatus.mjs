import WsBase from '../WsBase';

import {
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  User,
  ReferrerProfile,
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

      const order = await Order.findOne({
        where: {
          id: orderId,
        },
        include: [
          {
            model: Payment,
            where: { spentType: Payment.SPENT_TYPE.ORDER },
          },
          {
            model: OrderItem,
            include: [
              OrderItemStatus,
              {
                model: BlockchainTransaction,
                include: [BlockchainTransactionEventLog],
              },
            ],
          },
          User,
          ReferrerProfile,
        ],
        order: [[OrderItem, 'id', 'ASC']],
      });

      try {
        if (
          this.messageData.orderStatus !== order.status ||
          this.messageData.paymentStatus !== order.Payments[0].status
        ) {
          this.messageData.orderStatus = order.status;
          this.messageData.paymentStatus = order.Payments[0].status;

          try {
            if (
              order.Payments[0].processor === Payment.PROCESSOR.BITPAY &&
              order.status === Order.STATUS.NEW
            ) {
              await BitPay.getInvoiceWebHook(order.Payments[0].data.webhookData.id);
            }
            const orderDetailed = await Order.formatDetailed(order.get({ plain: true }));
            this.messageData.results = orderDetailed;
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
