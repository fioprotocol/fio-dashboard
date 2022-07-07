import Sequelize from 'sequelize';

import Coinpayments from '../../external/payment-processor/coinpayments';

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
    if (Coinpayments.isWebhook(hostname, this.context.userAgent)) {
      return Coinpayments;
    }

    return null;
  }

  async execute({ body, headers, hostname, rawBody }) {
    const paymentProcessor = this.getPaymentProcessor(headers, hostname);
    if (!paymentProcessor)
      throw new X({
        code: 'INVALID_REQUEST',
        fields: {
          code: 'UNKNOWN_REQUEST_HOST',
        },
      });

    this.validateRequest(paymentProcessor, { body, headers, rawBody });

    const webhookData = paymentProcessor.getWebhookData(body);
    const paymentStatuses = paymentProcessor.mapPaymentStatus(webhookData.status);
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
    if (webhookData.invoice && webhookData.orderNumber) {
      const order = await Order.findOne({
        where: {
          number: webhookData.orderNumber,
        },
        include: [OrderItem],
      });
      if (!order) {
        throw new X({
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
          code: 'WEBHOOK_DATA_ERROR',
          fields: {
            code: 'NO_PAYMENT_FOUND',
          },
        });
      }

      // todo: check if events could be received in different order
      const pEvent = await PaymentEventLog.create({
        status: paymentStatuses.event,
        statusNotes: webhookData.status_text,
        data: paymentProcessor.getWebhookMeta(webhookData),
        paymentId: payment.id,
      });
      try {
        payment.status = paymentStatuses.payment;
        payment.externalId = webhookData.txn_id;
        payment.price = webhookData.amount2;
        payment.currency = webhookData.currency2;
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
        });

        // Set item is ready to process if payment is completed
        if (paymentProcessor.isCompleted(webhookData.status)) {
          // todo: check also if paid amount is enough
          await Order.sequelize.transaction(async t => {
            for (const orderItem of order.OrderItems) {
              orderItemStatusUpdates.txStatus = BlockchainTransaction.STATUS.READY;

              const bcTx = await BlockchainTransaction.create(
                {
                  action: orderItem.action,
                  status: BlockchainTransaction.STATUS.READY,
                  data: orderItem.params,
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

    // todo: handle other webhooks types

    return { processed: true };
  }

  validateRequest(paymentProcessor, { body, headers, rawBody }) {
    if (!body)
      throw new X({
        code: 'INVALID_REQUEST_PARAMS',
        fields: {
          code: 'INVALID_BODY',
        },
      });

    paymentProcessor.validate(headers, body);
    paymentProcessor.authenticate(headers, body, rawBody);
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
