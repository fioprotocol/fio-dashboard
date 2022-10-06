import Base from '../Base';
import { Order, Payment } from '../../models';

import X from '../Exception.mjs';

export default class OrdersGet extends Base {
  static get validationRules() {
    return {
      orderNumber: 'string',
    };
  }
  async execute({ orderNumber }) {
    const order = await Order.findOne({
      where: {
        orderNumber,
        userId: this.context.id,
      },
      include: [Payment],
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
