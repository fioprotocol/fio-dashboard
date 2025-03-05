import Base from '../Base';
import { fioApi } from '../../external/fio.mjs';

import { Order, OrderItem, Payment } from '../../models';

import X from '../Exception.mjs';

import logger from '../../logger.mjs';
import { prepareOrderWithFioPaymentForExecution } from '../../utils/payment.mjs';
import { validate } from '../../external/captcha.mjs';
import MathOp from '../math.mjs';

export default class OrderProcessPayment extends Base {
  static get validationRules() {
    return {
      data: [
        {
          nested_object: {
            orderId: 'string',
            results: {
              list_of_objects: {
                fioName: 'string',
                action: 'string',
                fee_collected: 'string',
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
            captcha: {
              nested_object: {
                geetest_challenge: 'string',
                geetest_validate: 'string',
                geetest_seccode: 'string',
              },
            },
          },
        },
      ],
    };
  }

  async execute({ data }) {
    let order = await Order.getActive({
      userId: this.context.id,
      guestId: this.context.guestId,
    });

    if (!order) {
      // Check if payment received
      order = await Order.getPaidById({
        id: data.orderId,
        userId: this.context.id,
        guestId: this.context.guestId,
      });

      if (!order)
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            code: 'NOT_FOUND',
          },
        });

      return {
        data: { success: true },
      };
    }

    if (data.results) {
      const processedOrderItems = [];
      for (const regItem of data.results) {
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
        if (order.total === '0' && order.OrderItems.every(({ price }) => price === '0')) {
          if (!data.captcha) {
            throw new X({
              code: 'NOT_FOUND',
              fields: {
                code: 'NOT_FOUND',
              },
            });
          }

          if (!(await validate(data.captcha))) {
            throw new X({
              code: 'NOT_FOUND',
              fields: {
                code: 'NOT_FOUND',
              },
            });
          }
        }

        try {
          const fioNativePrice = data.results.reduce((acc, regItem) => {
            try {
              return new MathOp(acc || '0').add(regItem.fee_collected).toString();
            } catch (err) {
              logger.error(err);
            }
            return acc;
          }, null);
          await prepareOrderWithFioPaymentForExecution({
            paymentId: order.Payments[0].id,
            orderItems: order.OrderItems,
            fioNativePrice,
          });
          await order.update({ status: Order.STATUS.PAID });
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
    return ['data.captcha'];
  }

  static get resultSecret() {
    return [];
  }
}
