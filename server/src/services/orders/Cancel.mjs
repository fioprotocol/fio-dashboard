import Base from '../Base';

import { Order } from '../../models';

import X from '../Exception.mjs';

export default class OrdersCancel extends Base {
  async execute() {
    const order = await Order.getActive({
      userId: this.context.id,
      guestId: this.context.guestId,
    });

    if (!order) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          code: 'NOT_FOUND',
        },
      });
    }

    await Order.cancel(order);

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
