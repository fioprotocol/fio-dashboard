import Sequelize from 'sequelize';

import Base from '../Base';

import { Order } from '../../models';

export default class OrdersList extends Base {
  static get validationRules() {
    return {
      limit: 'string',
      offset: 'string',
      publicKey: 'string',
      userId: 'string',
    };
  }

  async execute({ limit, offset, publicKey, userId }) {
    const ordersList = await Order.list({
      userId,
      offset,
      limit,
      isProcessed: true,
      publicKey,
    });
    const totalOrdersCount = await Order.ordersCount({
      col: 'userId',
      where: {
        status: {
          [Sequelize.Op.notIn]: [Order.STATUS.NEW, Order.STATUS.CANCELED],
        },
        userId: this.context.id,
      },
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
