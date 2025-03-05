import Base from '../Base';
import { Order, OrderItem } from '../../models';

import { getDisplayOrderItems } from '../../utils/cart.mjs';

import X from '../Exception.mjs';

export default class OrdersActive extends Base {
  async execute() {
    const { id: userId, guestId } = this.context;

    if (!userId && !guestId) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    const order = await Order.getActive({
      userId,
      guestId,
    });

    if (!order) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    const payment = order.Payments[0];

    return {
      data: {
        id: order.id,
        number: order.number,
        publicKey: order.publicKey,
        orderItems: order.OrderItems.map(orderItem => ({
          id: orderItem.id,
          action: orderItem.action,
          address: orderItem.address,
          domain: orderItem.domain,
          price: orderItem.price,
          priceCurrency: orderItem.priceCurrency,
          createdAt: orderItem.createdAt,
          updatedAt: orderItem.updatedAt,
          blockchainTransactions: [],
          orderItemStatus: {},
        })),
        displayOrderItems: getDisplayOrderItems({
          orderItems: order.OrderItems.map(orderItem =>
            OrderItem.format(orderItem.get({ plain: true })),
          ),
          roe: order.roe,
        }),
        payment: {
          id: payment.id,
          processor: payment.processor,
          externalPaymentId: payment.externalId,
          amount: payment.amount,
          currency: payment.currency,
          secret: payment.data ? payment.data.secret : null,
        },
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
