import Sequelize from 'sequelize';

import Base from '../Base';

import { Order, OrderItem, Payment } from '../../models';

import X from '../Exception.mjs';

import { DAY_MS } from '../../config/constants.js';

export default class PaymentsCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            orderId: 'required',
            paymentProcessor: 'string',
          },
        },
      ],
    };
  }

  async execute({ data: { orderId, paymentProcessor: paymentProcessorKey } }) {
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: this.context.id,
        createdAt: {
          [Sequelize.Op.gt]: new Date(new Date().getTime() - DAY_MS),
        },
      },
      include: [OrderItem],
    });

    if (!order) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          orderId: 'NOT_FOUND',
        },
      });
    }

    const paymentData = await Payment.createForOrder(
      order,
      paymentProcessorKey,
      order.orderItems,
    );

    return {
      data: paymentData,
    };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
