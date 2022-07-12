import Base from '../Base';

import {
  Order,
  OrderItem,
  Payment,
  OrderItemStatus,
  BlockchainTransaction,
} from '../../models';
import Stripe from '../../external/payment-processor/stripe';

import X from '../Exception.mjs';

import logger from '../../logger.mjs';

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

  getPaymentProcessor(paymentProcessor) {
    if (paymentProcessor === Payment.PROCESSOR.CREDIT_CARD) {
      return Stripe;
    }

    return null;
  }

  async execute({ data: { orderId, paymentProcessor: paymentProcessorKey } }) {
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
        processor: paymentProcessorKey,
        orderId,
      },
    });

    if (exPayment) {
      throw new X({
        code: 'ALREADY_CREATED',
        fields: {
          paymentProcessor: 'ALREADY_CREATED',
        },
      });
    }

    const paymentProcessor = this.getPaymentProcessor(paymentProcessorKey);

    try {
      await Payment.sequelize.transaction(async t => {
        if (paymentProcessor)
          extPaymentParams = await paymentProcessor.create({
            amount: order.total,
            orderNumber: order.number,
          });

        orderPayment = await Payment.create(
          {
            amount: extPaymentParams.amount,
            currency: extPaymentParams.currency,
            status: Payment.STATUS.NEW,
            processor: paymentProcessorKey,
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
      if (paymentProcessor && extPaymentParams.secret) {
        await paymentProcessor.cancel(extPaymentParams.externalPaymentId);
      }

      logger.error(`Payment creation error ${e.message}. Order #${order.number}`);

      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          paymentProcessor: 'SERVER_ERROR',
        },
      });
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
