import Base from '../Base';
import { fioApi } from '../../external/fio.mjs';

import { Order, OrderItem, Payment } from '../../models';

import X from '../Exception.mjs';

import logger from '../../logger.mjs';
import { prepareOrderWithFioPaymentForExecution } from '../../utils/payment.mjs';

export default class OrderProcessPayment extends Base {
  static get validationRules() {
    return {
      data: [
        {
          nested_object: {
            results: [
              {
                nested_object: {
                  registered: [
                    {
                      list_of_objects: {
                        fioName: 'string',
                        action: 'string',
                        fee_collected: 'integer',
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
                  ],
                },
              },
            ],
          },
        },
      ],
    };
  }

  async execute({ data }) {
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

    if (data.results && data.results.registered) {
      const processedOrderItems = [];
      for (const regItem of data.results.registered) {
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

      if (order.Payments[0].processor === Payment.PROCESSOR.FIO) {
        try {
          const totalFioNativePrice = data.results.registered.reduce((acc, regItem) => {
            if (!isNaN(Number(regItem.fee_collected))) return acc + regItem.fee_collected;
            return acc;
          }, 0);

          await prepareOrderWithFioPaymentForExecution({
            paymentId: order.Payments[0].id,
            orderItems: order.OrderItems,
            fioNativePrice: totalFioNativePrice,
          });
          await order.update({ status: Order.STATUS.SUCCESS });
        } catch (e) {
          logger.error(`ORDER UPDATE ERROR ${order.id} #${order.number} - ${e.message}`);
        }
      } else {
        await order.update({ status: Order.STATUS.PAYMENT_PENDING });
      }
    }

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
