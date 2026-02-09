import Base from '../Base';
import { Order } from '../../models';

import X from '../Exception.mjs';

export default class OrdersGet extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
      publicKey: ['string', 'fio_public_key'],
    };
  }
  async execute({ id, publicKey }) {
    const userId = this.context.id;
    const guestId = this.context.guestId;

    const where = {
      publicKey,
    };

    // Logged-in user: restrict to their own orders
    if (userId) {
      where.userId = userId;
    }
    // For guests (no-profile flow) and unauthenticated users,
    // find order by orderId + publicKey only.
    // Payment data is stripped below based on ownership.

    const order = await Order.orderInfo(id, {
      useFormatDetailed: true,
      onlyOrderPayment: true,
      removePaymentData: true,
      orderWhere: where,
    });
    if (!order)
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });

    // Show payment details only if:
    // 1. User is logged in, OR
    // 2. Guest session matches the order's guestId (same guest who placed the order)
    // Otherwise strip all payment data.
    const isOrderOwnerGuest = guestId && order.guestId === guestId;
    if (!userId && !isOrderOwnerGuest) {
      delete order.payment;
    }

    // Never expose guestId to the client
    delete order.guestId;

    return { data: order };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
