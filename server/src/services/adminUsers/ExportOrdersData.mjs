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
    };
  }

  async execute({ filters }) {
    let offset = 0;
    let allOrders = [];
    let allOrderItems = [];
    let hasMoreData = true;
    const batchSize = config.exportOrdersCSVLimit;

    // Fetch orders and their items in batches
    while (hasMoreData) {
      const ordersBatch = await Order.listAll({
        offset,
        limit: batchSize,
        filters,
      });

      if (!ordersBatch.length || ordersBatch.length < batchSize) {
        hasMoreData = false;
      }

      // Get order items for current batch
      if (ordersBatch.length > 0) {
        const orderItemsBatch = await OrderItem.listAll({
          ordersIds: ordersBatch.map(order => order.id),
        });

        allOrders = [...allOrders, ...ordersBatch];
        allOrderItems = [...allOrderItems, ...orderItemsBatch];
      }

      offset += batchSize;
    }

    return {
      data: {
        orders: allOrders,
        orderItems: allOrderItems,
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
