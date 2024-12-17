import Base from '../Base';
import { fioApi } from '../../external/fio.mjs';

import { Order, OrderItem, Payment } from '../../models';

import X from '../Exception.mjs';

export default class OrderPreparedTx extends Base {
  static get validationRules() {
    return {
      data: {
        list_of_objects: {
          fioName: 'string',
          action: 'string',
          data: [
            {
              nested_object: {
                signedTx: [
                  {
                    nested_object: {
                      compression: 'integer',
                      packed_context_free_data: 'string',
                      packed_trx: 'string',
                      signatures: { list_of: 'string' },
                    },
                  },
                ],
                signingWalletPubKey: 'string',
              },
            },
          ],
        },
      },
    };
  }

  async execute({ data: items }) {
    const order = await Order.getActive({
      userId: this.context.id,
      guestId: this.context.guestId,
    });

    const paymentProcessor =
      order && order.Payments && order.Payments[0] ? order.Payments[0].processor : null;

    if (
      !order ||
      [Payment.PROCESSOR.STRIPE, Payment.PROCESSOR.BITPAY].indexOf(paymentProcessor) < 0
    ) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          code: 'NOT_FOUND',
        },
      });
    }

    if (items) {
      const processedOrderItems = [];
      for (const regItem of items) {
        const { fioName, action: itemAction, data: itemData } = regItem;

        const orderItem = order.OrderItems.find(
          ({ id, address, domain, action }) =>
            !processedOrderItems.includes(id) &&
            fioApi.setFioName(address, domain) === fioName &&
            action === itemAction,
        );

        if (orderItem && itemData) {
          await OrderItem.update(
            { data: { ...(orderItem.data ? orderItem.data : {}), ...itemData } },
            { where: { id: orderItem.id } },
          );
          processedOrderItems.push(orderItem.id);
        }
      }
    }

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
