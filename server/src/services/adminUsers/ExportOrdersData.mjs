import Sequelize from 'sequelize';

import Base from '../Base';
import { Order, OrderItem } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

const { Op } = Sequelize;

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
          },
        },
      ],
    };
  }

  async execute({ filters }) {
    const ordersList = await Order.listAll({
      limit: 0,
      filters,
    });

    const ordersIds = ordersList.map(order => order.id);

    const orderItemsList = await OrderItem.listAll(0, null, {
      orderId: { [Op.or]: ordersIds },
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
