import Base from '../Base';

import {
  Order,
  OrderItem,
  Payment,
  OrderItemStatus,
  BlockchainTransaction,
} from '../../models';

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

    const paymentProcessor = Payment.getPaymentProcessor(paymentProcessorKey);

    const exPayment = await Payment.findOne({
      where: {
        status: Payment.STATUS.NEW,
        orderId,
      },
    });

    // Remove existing payment when trying to create new one for the order
    if (exPayment) {
      try {
        if (exPayment.externalId) await paymentProcessor.cancel(exPayment.externalId);
        await exPayment.destroy({ force: true });
      } catch (e) {
        logger.error(
          `Existing Payment removing error ${e.message}. Order #${order.number}. Payment ${exPayment.id}`,
        );
      }
    }

    try {
      await Payment.sequelize.transaction(async t => {
        if (paymentProcessor)
          extPaymentParams = await paymentProcessor.create({
            amount: order.total,
            orderNumber: order.number,
          });

        orderPayment = await Payment.create(
          {
            price: extPaymentParams.amount,
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
