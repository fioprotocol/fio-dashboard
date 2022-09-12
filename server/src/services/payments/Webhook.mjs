import Sequelize from 'sequelize';

import Stripe from '../../external/payment-processor/stripe';

import Base from '../Base';
import X from '../Exception';

import logger from '../../logger.mjs';

import {
  Order,
  Payment,
  PaymentEventLog,
  OrderItem,
  OrderItemStatus,
  BlockchainTransaction,
} from '../../models';

export default class PaymentsWebhook extends Base {
  static get validationRules() {
    return {
      body: 'any_object',
      headers: 'any_object',
      hostname: 'string',
      rawBody: 'string',
    };
  }

  getPaymentProcessor(headers, hostname) {
    if (Stripe.isWebhook(hostname, this.context.userAgent)) {
      return Stripe;
    }

    return null;
  }

  async execute({ body, headers, hostname, rawBody }) {
    const paymentProcessor = this.getPaymentProcessor(headers, hostname);
    if (!paymentProcessor)
      throw new X({
        status: 417,
        code: 'INVALID_REQUEST',
        fields: {
          code: 'UNKNOWN_REQUEST_HOST',
        },
      });

    body = this.validateRequest(paymentProcessor, { body, headers, rawBody });

    const webhookData = paymentProcessor.getWebhookData(body);
    const paymentStatuses = paymentProcessor.mapPaymentStatus(
      webhookData.status,
      webhookData.type,
    );
    // Your IPN handler must always check to see if a payment has already been handled
    // before to avoid double-crediting users, etc. in the case of duplicate IPNs.
    const existingPayment = await Payment.findOne({
      where: {
        externalId: webhookData.txn_id,
      },
      include: [PaymentEventLog],
    });

    if (existingPayment) {
      for (const event of existingPayment.PaymentEventLogs) {
        const eventProcessed = event.data
          ? paymentProcessor.checkEvent(event.data, webhookData)
          : false;
        if (eventProcessed) return { processed: true };
      }
    }

    // Process order payment webhook
    if (webhookData.orderNumber) {
      const order = await Order.findOne({
        where: {
          number: webhookData.orderNumber,
        },
        include: [OrderItem],
      });
      if (!order) {
        throw new X({
          status: 400,
          code: 'WEBHOOK_DATA_ERROR',
          fields: {
            code: 'NO_ORDER_FOUND',
          },
        });
      }

      const payment = await Payment.findOneWhere({
        [Sequelize.Op.or]: [
          {
            externalId: webhookData.txn_id,
            orderId: order.id,
            spentType: Payment.SPENT_TYPE.ORDER,
          },
          {
            externalId: null,
            status: Payment.STATUS.NEW,
            orderId: order.id,
            spentType: Payment.SPENT_TYPE.ORDER,
          },
        ],
      });
      if (!payment) {
        throw new X({
          status: 400,
          code: 'WEBHOOK_DATA_ERROR',
          fields: {
            code: 'NO_PAYMENT_FOUND',
          },
        });
      }

      if (
        [
          Payment.STATUS.COMPLETED,
          Payment.STATUS.CANCELLED,
          Payment.STATUS.EXPIRED,
        ].indexOf(payment.status) > -1
      ) {
        return { processed: true };
      }

      const pEvent = await PaymentEventLog.create({
        status: paymentStatuses.event,
        statusNotes: webhookData.status_text,
        data: paymentProcessor.getWebhookMeta(webhookData),
        paymentId: payment.id,
      });
      try {
        payment.status = paymentStatuses.payment;
        payment.externalId = webhookData.txn_id;
        payment.price = webhookData.amount;
        payment.currency = webhookData.currency;
        payment.data = { ...payment.data, webhookData };
        const orderItemStatusUpdates = {
          paymentStatus: paymentStatuses.payment,
        };

        // Update payment
        await Order.sequelize.transaction(async t => {
          await payment.save({
            transaction: t,
          });
          await OrderItemStatus.update(orderItemStatusUpdates, {
            where: {
              orderItemId: {
                [OrderItemStatus.sequelize.Op.in]: order.OrderItems.map(({ id }) => id),
              },
              paymentId: payment.id,
            },
            transaction: t,
          });
          await Order.updateStatus(order.id, payment.status, [], t);
        });

        // Set item is ready to process if payment is completed
        if (paymentProcessor.isCompleted(webhookData.status)) {
          await Order.sequelize.transaction(async t => {
            for (const orderItem of order.OrderItems) {
              const bcTx = await BlockchainTransaction.create(
                {
                  action: orderItem.action,
                  status: BlockchainTransaction.STATUS.READY,
                  data: { params: orderItem.params },
                  orderItemId: orderItem.id,
                },
                {
                  transaction: t,
                },
              );

              await OrderItemStatus.update(
                {
                  txStatus: BlockchainTransaction.STATUS.READY,
                  blockchainTransactionId: bcTx.id,
                },
                {
                  where: {
                    orderItemId: orderItem.id,
                    paymentId: payment.id,
                    txStatus: BlockchainTransaction.STATUS.NONE,
                  },
                  transaction: t,
                },
              );
            }
          });
        }
      } catch (e) {
        logger.error(
          e,
          `Update payment status error, webhook identifier - ${paymentProcessor.getWebhookIdentifier(
            webhookData,
          )}. Payment event id - ${pEvent.id}`,
        );
      }

      return { processed: true };
    }

    return { processed: true };
  }

  validateRequest(paymentProcessor, { body, headers, rawBody }) {
    if (!body)
      throw new X({
        status: 400,
        code: 'INVALID_REQUEST_PARAMS',
        fields: {
          code: 'INVALID_BODY',
        },
      });

    paymentProcessor.validate(headers, body);
    return paymentProcessor.authenticate(headers, body, rawBody);
  }

  static get paramsSecret() {
    return ['body', 'rawBody'];
  }

  static get resultSecret() {
    return [];
  }
}
