import Base from '../Base';

import {
  Order,
  OrderItem,
  Payment,
  OrderItemStatus,
  BlockchainTransaction,
} from '../../models';
import Stripe from '../../external/payment-processor/stripe';
import MathOp from '../math.mjs';

import X from '../Exception.mjs';

export default class PaymentsCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            orderId: 'required',
            paymentProcessor: 'string',
          },
        },
      ],
    };
  }

  async createExternal(paymentProcessor, options) {
    if (paymentProcessor === Payment.PROCESSOR.CREDIT_CARD) {
      return Stripe.create(options);
    }
  }

  async execute({ data: { orderId, paymentProcessor } }) {
    let orderPayment = {};
    let extPaymentParams = {};

    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: this.context.id,
      },
      include: [OrderItem],
    });

    if (!order) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          orderId: 'NOT_FOUND',
        },
      });
    }

    const exPayment = await Payment.findOne({
      where: {
        status: Payment.STATUS.NEW,
        processor: paymentProcessor,
        orderId,
      },
    });

    if (exPayment) {
      throw new X({
        code: 'ALREADY_CREATED',
      });
    }

    try {
      await Payment.sequelize.transaction(async t => {
        extPaymentParams = await this.createExternal(paymentProcessor, {
          amount: new MathOp(order.total).mul(100).toNumber(),
          orderNumber: order.number,
        });

        orderPayment = await Payment.create(
          {
            amount: extPaymentParams.amount, // todo: cents or dollars ? int or float?
            currency: extPaymentParams.currency,
            status: Payment.STATUS.NEW,
            processor: paymentProcessor,
            externalId: extPaymentParams.externalPaymentId,
            orderId: order.id,
          },
          { transaction: t },
        );

        for (const orderItem of order.OrderItems) {
          await OrderItemStatus.create(
            {
              txStatus: BlockchainTransaction.STATUS.NONE,
              paymentStatus: orderPayment.status,
              blockchainTransactionId: null,
              paymentId: orderPayment.id,
              orderItemId: orderItem.id,
            },
            { transaction: t },
          );
        }
      });
    } catch (e) {
      if (extPaymentParams.secret) {
        // todo: handle
      }
    }

    return {
      data: {
        id: orderPayment.id,
        ...extPaymentParams,
      },
    };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
