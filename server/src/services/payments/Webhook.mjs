import Coinpayments from '../../external/payment-processor/coinpayments';

import Base from '../Base';
import X from '../Exception';

import { Order, Payment, PaymentEventLog } from '../../models';

export default class PaymentsWebhook extends Base {
  static get validationRules() {
    return {
      body: 'any_object',
      headers: 'any_object',
      hostname: 'string',
    };
  }

  getPaymentProcessor(headers, hostname) {
    if (Coinpayments.isWebhook(hostname)) {
      return Coinpayments;
    }

    return null;
  }

  async execute({ body, headers, hostname }) {
    const paymentProcessor = this.getPaymentProcessor(headers, hostname);
    if (!paymentProcessor)
      throw new X({
        code: 'INVALID_REQUEST',
        fields: {
          code: 'UNKNOWN_REQUEST_HOST',
        },
      });

    this.validateRequest(paymentProcessor, { body, headers });

    const webhookData = paymentProcessor.getWebhookData(body);
    // Your IPN handler must always check to see if a payment has already been handled
    // before to avoid double-crediting users, etc. in the case of duplicate IPNs.
    const existingPayment = await Payment.findOneWhere({
      externalId: webhookData.txn_id,
      status: paymentProcessor.mapPaymentStatus(webhookData.status),
    });

    if (existingPayment) {
      return { processed: true };
    }

    if (webhookData.invoice && webhookData.orderNumber) {
      const order = await Order.findOneWhere({ number: webhookData.orderNumber });
      if (!order) {
        throw new X({
          code: 'WEBHOOK_DATA_ERROR',
          fields: {
            code: 'NO_ORDER_FOUND',
          },
        });
      }

      const payment = await Payment.findOneWhere({
        orderId: order.id,
        spentType: Payment.SPENT_TYPE().ORDER,
      });
      if (!payment) {
        throw new X({
          code: 'WEBHOOK_DATA_ERROR',
          fields: {
            code: 'NO_PAYMENT_FOUND',
          },
        });
      }

      const paymentStatuses = paymentProcessor.mapPaymentStatus(webhookData.status);
      await PaymentEventLog.create({
        status: paymentStatuses.event,
        statusNotes: webhookData.status_text,
      });
      payment.status = paymentStatuses.payment;
      payment.externalId = webhookData.txn_id;
      payment.data = { ...payment.data, webhookData };
      await payment.save();

      return { processed: true };
    }

    throw new X({
      code: 'WEBHOOK_DATA_ERROR',
      fields: {
        code: 'MISS_WEBHOOK_DATA',
      },
    });
  }

  validateRequest(paymentProcessor, { body, headers }) {
    if (!body)
      throw new X({
        code: 'INVALID_REQUEST_PARAMS',
        fields: {
          code: 'INVALID_BODY',
        },
      });

    paymentProcessor.validate(headers, body);
    paymentProcessor.authenticate(body, headers['HTTP_HMAC']);
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
