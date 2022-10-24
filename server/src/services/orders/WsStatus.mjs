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
            orderId: 'integer',
          },
        },
      ],
    };
  }

  async watch({ data: { orderId } }) {
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
        userId: this.context.id,
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
    });

    try {
      if (
        this.messageData.orderStatus !== order.status ||
        this.messageData.paymentStatus !== order.Payments[0].status
      ) {
        this.messageData.orderStatus = order.status;
        this.messageData.paymentStatus = order.Payments[0].status;

        try {
          const orderDetailed = await Order.formatDetailed(order.get({ plain: true }));
          this.messageData.results = orderDetailed;
        } catch (e) {
          logger.error(`WS ERROR. Order items set. ${orderId}. ${e}`);
        }

        this.send(
          JSON.stringify({
            data: this.messageData,
          }),
        );
      }
    } catch (e) {
      logger.error(`WS ERROR. Order status. ${orderId}. ${e}`);
    }
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return [];
  }
}
