import Base from '../Base';
import { Order, OrderItem } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';
import config from '../../config/index.mjs';

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
      limit: ['integer', { min_number: 0 }, { max_number: config.exportOrdersCSVLimit }],
      offset: ['integer', { min_number: 0 }],
    };
  }

  async execute({ filters, limit, offset }) {
    const orders = await Order.listAll({
      filters,
      limit,
      offset,
    });

    const orderItems = await OrderItem.listAll({
      ordersIds: orders.map(order => order.id),
    });

    return {
      data: {
        orders,
        orderItems,
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
