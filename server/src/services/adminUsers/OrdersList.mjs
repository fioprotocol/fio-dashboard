import Base from '../Base';
import { Order } from '../../models';
import { USER_ROLES_IDS } from '../../config/constants.js';

export default class OrdersList extends Base {
  static get requiredPermissions() {
    return [USER_ROLES_IDS.ADMIN, USER_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
    };
  }

  async execute({ limit = 25, offset = 0 }) {
    const ordersList = await Order.listAll(limit, offset);
    const ordersCount = await Order.ordersCount();

    return {
      data: {
        orders: ordersList.map(order => Order.format(order.get({ plain: true }))),
        maxCount: ordersCount,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.users[*].email'];
  }
}
