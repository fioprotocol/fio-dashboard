import Base from '../Base';
import { Order } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../../constants/general.mjs';

export default class OrdersList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      offset: ['integer', { min_number: 0 }],
      limit: ['integer', { min_number: 0 }, { max_number: MAX_LIMIT }],
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

  async execute({ limit = DEFAULT_LIMIT, offset = 0, filters }) {
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
