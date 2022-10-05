import Base from '../Base';
import { Order, OrderItem } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class ExportOrdersData extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  async execute() {
    const ordersList = await Order.listAll(0);
    const orderItemsList = await OrderItem.listAll(0);

    return {
      data: {
        orders: ordersList,
        orderItems: orderItemsList,
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
