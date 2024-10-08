import Sequelize from 'sequelize';

import Base from '../Base';
import { Order, OrderItem, Payment } from '../../models';

import X from '../Exception.mjs';

const CART_TIMEOUT = 1000 * 60 * 30; // 30 min

export default class OrdersActive extends Base {
  static get validationRules() {
    return {
      publicKey: 'string',
    };
  }

  async execute({ publicKey }) {
    const where = {
      status: Order.STATUS.NEW,
      updatedAt: {
        [Sequelize.Op.gt]: new Date(new Date().getTime() - CART_TIMEOUT),
      },
    };

    const userId = this.context.id;
    const guestId = this.context.guestId;

    if (!userId && !guestId && !publicKey) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    if (userId) {
      where.userId = userId;
    }

    if (guestId) {
      where.guestId = guestId;
    }

    if (publicKey) {
      where.publicKey = publicKey;
    }

    const order = await Order.findOne({
      where,
      include: [Payment, OrderItem],
      order: [['createdAt', 'DESC']],
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
        payment:
          (payment && userId === order.userId) || guestId === order.guestId
            ? {
                id: payment.id,
                processor: payment.processor,
                externalPaymentId: payment.externalId,
                amount: payment.amount,
                currency: payment.currency,
                secret: payment.data ? payment.data.secret : null,
              }
            : null,
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
