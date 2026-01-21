import { Op } from 'sequelize';

import CommonJob from './job.mjs';

import Stripe from '../external/payment-processor/stripe.mjs';
import Bitpay from '../external/payment-processor/bitpay.mjs';

import logger from '../logger.mjs';

import { Order, Payment, OrderItem, OrderItemStatus } from '../models';

// https://stripe.com/docs/payments/intents#intent-statuses
const STRIPE_INTENT_SUCCESS = 'succeeded';
// https://bitpay.com/api/#rest-api-resources-invoices-resource
const BITPAY_PAYMENT_SUCCESS = 'paid';

class PaymentsJob extends CommonJob {
  async fetchIntentFromAPI(id, processor) {
    let intent;
    if (processor === Payment.PROCESSOR.STRIPE) {
      intent = await Stripe.retrieveIntent(id);
    } else if (processor === Payment.PROCESSOR.BITPAY) {
      intent = await Bitpay.retrieveIntent(id);
    }
    return intent;
  }

  getSuccessStatusByProcessor(processor) {
    if (processor === Payment.PROCESSOR.STRIPE) {
      return STRIPE_INTENT_SUCCESS;
    }
    if (processor === Payment.PROCESSOR.BITPAY) {
      return BITPAY_PAYMENT_SUCCESS;
    }
  }

  testPaymentSuccess(entry) {
    const [processor, status] = entry;
    const successStatus = this.getSuccessStatusByProcessor(processor);
    return status === successStatus;
  }

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
          where: {
            [Op.or]: [
              { processor: Payment.PROCESSOR.STRIPE },
              { processor: Payment.PROCESSOR.BITPAY },
            ],
          },
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
          const intent = this.fetchIntentFromAPI(intentId, payment.processor);
          paymentStatuses.push([payment.processor, intent.status]);
          if (intent.status === this.getSuccessStatusByProcessor(payment.processor)) {
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

        const allSucceeded = paymentStatuses.every(this.testPaymentSuccess);
        const someSucceeded = paymentStatuses.some(this.testPaymentSuccess);
        if (allSucceeded) {
          await order.update({ status: Order.STATUS.SUCCESS }, { transaction: t });
        } else if (someSucceeded) {
          await order.update(
            { status: Order.STATUS.PARTIALLY_SUCCESS },
            { transaction: t },
          );
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
