import Base from '../Base';
import { Order } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class OrdersList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
      filters: [
        {
          nested_object: {
            createdAt: 'string',
            dateRange: [
              {
                nested_object: {
                  startDate: 'integer',
                  endDate: 'integer',
                },
              },
            ],
            status: 'integer',
            total: 'integer',
          },
        },
      ],
    };
  }

  async execute({ limit = 25, offset = 0, filters }) {
    const ordersList = await Order.listAll({
      limit,
      offset,
      filters,
    });

    return {
      data: {
        orders: ordersList,
        maxCount: ordersList && ordersList[0] ? +ordersList[0].maxCount : 0,
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
