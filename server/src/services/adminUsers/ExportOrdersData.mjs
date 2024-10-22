import Base from '../Base';
import { Order, OrderItem } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class ExportOrdersData extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      filters: [
        {
          nested_object: {
            dateRange: [
              {
                nested_object: {
                  startDate: 'integer',
                  endDate: 'integer',
                },
              },
            ],
            status: 'integer',
            freeStatus: 'integer',
            orderUserType: 'string',
          },
        },
      ],
      offest: 'integer',
      limit: 'integer',
    };
  }

  async execute({ offset, filters, limit }) {
    const ordersList = await Order.listAll({
      offset,
      limit,
      filters,
    });

    const ordersIds = ordersList.map(order => order.id);
    const orderItemsList = await OrderItem.listAll({
      ordersIds,
    });

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
