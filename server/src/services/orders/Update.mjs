import Base from '../Base';

import { Order } from '../../models';
import X from '../Exception.mjs';

export default class OrdersUpdate extends Base {
  static get validationRules() {
    return {
      id: 'string',
      publicKey: 'string',
      data: [
        {
          nested_object: {
            status: 'string',
          },
        },
      ],
    };
  }

  async execute({ id, data }) {
    const order = await Order.findOneWhere({ id, userId: this.context.id });

    if (!order) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          code: 'NOT_FOUND',
        },
      });
    }

    await Order.update(data, { where: { id, userId: this.context.id } });

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return [];
  }
}
