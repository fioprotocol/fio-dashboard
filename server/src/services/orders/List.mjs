import Sequelize from 'sequelize';

import Base from '../Base';
import X from '../Exception';

import { Order } from '../../models';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../../constants/general.mjs';

export default class OrdersList extends Base {
  static get validationRules() {
    return {
      offset: ['integer', { min_number: 0 }],
      limit: ['integer', { min_number: 0 }, { max_number: MAX_LIMIT }],
      publicKey: 'string',
    };
  }

  async execute({ limit = DEFAULT_LIMIT, offset = 0, publicKey }) {
    const userId = this.context.id;

    if (!userId && !publicKey) {
      throw new X({
        code: 'GET_ORDERS_LIST_ERROR',
        fields: {
          userId: 'MISSING_USER_ID',
          publicKey: 'MISSING_PUBLIC_KEY',
        },
      });
    }

    const ordersList = await Order.list({
      userId,
      offset,
      limit,
      isProcessed: true,
      publicKey,
    });

    const ordersCountWhere = {
      status: {
        [Sequelize.Op.notIn]: [Order.STATUS.NEW, Order.STATUS.CANCELED],
      },
    };

    if (userId) {
      ordersCountWhere.userId = userId;
    }
    if (publicKey) {
      ordersCountWhere.publicKey = publicKey;
    }

    const totalOrdersCount = await Order.ordersCount({
      col: userId ? 'userId' : 'publicKey',
      where: ordersCountWhere,
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
