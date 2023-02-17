import CommonJob from './job.mjs';

import Stripe from '../external/payment-processor/stripe.mjs';

import logger from '../logger.mjs';

import { Order, Payment, OrderItem, OrderItemStatus } from '../models';

// https://stripe.com/docs/payments/intents#intent-statuses
const STRIPE_INTENT_SUCCESS = 'succeeded';

class PaymentsJob extends CommonJob {
  async execute() {
    const orders = await Order.findAll({
      where: {
        status: Order.STATUS.PAYMENT_PENDING,
      },
      include: [OrderItem, Payment],
    });

    const t = await Order.sequelize.transaction();

    try {
      for (const order of orders) {
        const payments = await order.getPayments({
          where: { processor: Payment.PROCESSOR.STRIPE },
        });
        const paymentStatuses = [];
        for (const payment of payments) {
          const orderItemStatus = await OrderItemStatus.findOne({
            where: {
              paymentId: payment.id,
            },
            transaction: t,
          });

          const intentId = payment.externalId;
          const intent = await Stripe.retrieveIntent(intentId);
          paymentStatuses.push(intent.status);
          if (intent.status === STRIPE_INTENT_SUCCESS) {
            await payment.update(
              { status: Payment.STATUS.COMPLETED },
              { transaction: t },
            );
            await orderItemStatus.update(
              { paymentStatus: Payment.STATUS.COMPLETED },
              { transaction: t },
            );
          } else {
            await payment.update({ status: Payment.STATUS.FAILED }, { transaction: t });
            await orderItemStatus.update(
              { paymentStatus: Payment.STATUS.FAILED },
              { transaction: t },
            );
          }
        }

        const allSucceeded = paymentStatuses.some(
          status => status === STRIPE_INTENT_SUCCESS,
        );
        if (allSucceeded) {
          await order.update({ status: Order.STATUS.SUCCESS }, { transaction: t });
        } else {
          await order.update({ status: Order.STATUS.FAILED }, { transaction: t });
        }
      }
      await t.commit();
    } catch (error) {
      logger.error(`Update transaction failed error: ${error.message}`);
      await t.rollback();
    }
  }
}

new PaymentsJob().execute();
