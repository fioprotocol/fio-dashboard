import Base from '../Base';
import {
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  ReferrerProfile,
  User,
} from '../../models';

import X from '../Exception.mjs';

export default class OrdersGet extends Base {
  static get validationRules() {
    return {
      id: 'string',
    };
  }
  async execute({ id }) {
    const order = await Order.findOne({
      where: {
        id,
      },
      include: [
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
        {
          model: Payment,
          where: { spentType: Payment.SPENT_TYPE.ORDER },
        },
        User,
        ReferrerProfile,
      ],
      order: [[OrderItem, 'id', 'ASC']],
    });

    if (!order)
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });

    return {
      data: await Order.formatDetailed(order.get({ plain: true })),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
