import Sequelize from 'sequelize';

import Base from '../Base';
import { Order, Payment } from '../../models';

import X from '../Exception.mjs';

const CART_TIMEOUT = 1000 * 60 * 30; // 30 min

export default class OrdersActive extends Base {
  async execute() {
    const order = await Order.findOne({
      where: {
        status: Order.STATUS.NEW,
        userId: this.context.id,
        createdAt: {
          [Sequelize.Op.gt]: new Date(new Date().getTime() - CART_TIMEOUT),
        },
      },
      include: [Payment],
      order: [['createdAt', 'DESC']],
    });

    if (!order)
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });

    const payment = order.Payments[0];

    return {
      data: {
        id: order.id,
        number: order.number,
        publicKey: order.publicKey,
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
