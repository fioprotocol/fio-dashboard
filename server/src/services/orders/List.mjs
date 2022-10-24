import Base from '../Base';

import { Order } from '../../models';

export default class OrdersList extends Base {
  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
    };
  }

  async execute({ offset, limit }) {
    const ordersList = await Order.list(this.context.id, null, offset, limit);
    const totalOrdersCount = await Order.ordersCount({
      col: 'userId',
      where: { userId: this.context.id },
    });

    const orders = [];
    for (const order of ordersList) {
      orders.push(await Order.formatToMinData(order.get({ plain: true })));
    }

    return {
      data: {
        orders,
        totalOrdersCount,
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
