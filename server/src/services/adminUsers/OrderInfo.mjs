import Base from '../Base';
import X from '../Exception';

import { Order } from '../../models';
import { USER_ROLES_IDS } from '../../config/constants.js';

export default class OrderInfo extends Base {
  static get requiredPermissions() {
    return [USER_ROLES_IDS.ADMIN, USER_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      id: ['required'],
    };
  }

  async execute({ id }) {
    const order = await Order.orderInfo(id);

    if (!order) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    return {
      data: Order.format(order.get({ plain: true })),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
