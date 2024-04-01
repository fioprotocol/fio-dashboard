import StripeLib from 'stripe';

import PaymentProcessor from './base.mjs';
import MathOp from '../../services/math.mjs';
import X from '../../services/Exception.mjs';

import { PAYMENT_EVENT_STATUSES, PAYMENTS_STATUSES } from '../../config/constants.js';

export const STRIPE_STATUSES = {
  FAILED: 'payment_failed',
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  CANCELLED_TIMED_OUT: 'canceled',
  WAITING: 'processing',
  NEW: 'created',
  COMPLETED: 'succeeded',
  REQUIRES_ACTION: 'requires_action',
  CHARGE_SUCCEEDED: 'charge.succeeded',
  CHARGE_FAILED: 'failed',
};

const OBJ_TYPES = {
  payment_intent: 'payment_intent',
  charge: 'charge',
};

const PI_TYPES = {
  succeeded: 'payment_intent.succeeded',
  created: 'payment_intent.created',
  amount_capturable_updated: 'payment_intent.amount_capturable_updated',
  canceled: 'payment_intent.canceled',
  partially_funded: 'payment_intent.partially_funded',
  payment_failed: 'payment_intent.payment_failed',
  requires_action: 'payment_intent.requires_action',
  charge_failed: 'charge.failed',
};

const STRIPE_USER_AGENT = 'Stripe/1.0';

const CHARGE_FAIL_REASON = {
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  BLOCKED: 'blocked',
};

const stripe = new StripeLib(process.env.STRIPE_SECRET);
class Stripe extends PaymentProcessor {
  isWebhook(hostname, userAgent) {
    const checkRegex = new RegExp(`${STRIPE_USER_AGENT}`, 'i');
    return checkRegex.exec(userAgent);
  }

  getWebhookData(body) {
    const {
      id,
      type,
      created,
      data: { object },
    } = body;
    let data = { id, type, created };
    if ([OBJ_TYPES.payment_intent, OBJ_TYPES.charge].includes(object.object)) {
      const {
        id: txn_id,
        receipt_email,
        status,
        amount,
        amount_received,
        application_fee_amount,
        charges,
        currency,
        description,
        customer,
        invoice,
        client_secret,
        outcome,
        payment_intent,
      } = object;

      data = {
        ...data,
        email: receipt_email,
        txn_id: object.object === OBJ_TYPES.payment_intent ? txn_id : payment_intent,
        status,
        amount: new MathOp(amount).div(100).toString(),
        amount_cents: amount,
        amount_received: amount_received
          ? new MathOp(amount_received).div(100).toString()
          : amount_received,
        amount_received_cents: amount_received,
        charges,
        currency,
        net: null,
        fee: application_fee_amount,
        description,
        orderNumber: description || invoice,
        invoice,
        customer,
        client_secret,
        outcome,
      };
    }

    return data;
  }
  getWebhookMeta(data) {
    return {
      ...super.getWebhookMeta(data),
      type: data.type,
    };
  }

  isCompleted(status) {
    return status === STRIPE_STATUSES.COMPLETED;
  }

  mapPaymentStatus(stripeStatus, webhookType, reason) {
    if (this.isCompleted(stripeStatus)) {
      return {
        payment: PAYMENTS_STATUSES.COMPLETED,
        event: PAYMENT_EVENT_STATUSES.SUCCESS,
      };
    }

    switch (stripeStatus) {
      case STRIPE_STATUSES.REQUIRES_PAYMENT_METHOD:
        if (webhookType === PI_TYPES.payment_failed)
          return {
            payment: PAYMENTS_STATUSES.NEW,
            event: PAYMENT_EVENT_STATUSES.FAILED,
          };

        return {
          payment: PAYMENTS_STATUSES.NEW,
          event: PAYMENT_EVENT_STATUSES.PENDING,
        };
      case STRIPE_STATUSES.CANCELLED_TIMED_OUT:
        return {
          payment: PAYMENTS_STATUSES.CANCELLED,
          event: PAYMENT_EVENT_STATUSES.CANCEL,
        };
      case STRIPE_STATUSES.FAILED: {
        return {
          payment: PAYMENTS_STATUSES.EXPIRED,
          event: PAYMENT_EVENT_STATUSES.FAILED,
        };
      }
      case STRIPE_STATUSES.WAITING:
        return {
          payment: PAYMENTS_STATUSES.PENDING,
          event: PAYMENT_EVENT_STATUSES.PENDING,
        };
      case STRIPE_STATUSES.REQUIRES_ACTION:
        return {
          payment: PAYMENTS_STATUSES.USER_ACTION_PENDING,
          event: PAYMENT_EVENT_STATUSES.USER_ACTION_PENDING,
        };
      case STRIPE_STATUSES.CHARGE_FAILED: {
        if (reason) {
          if (reason.reason === CHARGE_FAIL_REASON.INSUFFICIENT_FUNDS)
            return {
              payment: PAYMENTS_STATUSES.INSUFFICIENT_FUNDS,
              event: PAYMENT_EVENT_STATUSES.INSUFFICIENT_FUNDS,
            };
          if (reason.type === CHARGE_FAIL_REASON.BLOCKED) {
            return {
              payment: PAYMENTS_STATUSES.BLOCKED,
              event: PAYMENT_EVENT_STATUSES.BLOCKED,
            };
          }
        }

        return {
          payment: PAYMENTS_STATUSES.CHARGE_FAILED,
          event: PAYMENT_EVENT_STATUSES.CHARGE_FAILED,
        };
      }
      default:
        return {
          payment: PAYMENTS_STATUSES.PENDING,
          event: PAYMENT_EVENT_STATUSES.PENDING,
        };
    }
  }

  validate(headers, body) {
    if (!headers || !headers['stripe-signature'])
      throw new X({
        status: 417,
        code: 'INVALID_REQUEST_PARAMS',
        fields: {
          code: 'INVALID_REQUEST_HEADERS',
        },
      });

    const { api_version, type } = body;

    if (!api_version || api_version !== process.env.STRIPE_API_VERSION)
      throw new X({
        status: 400,
        code: 'INVALID_REQUEST_PARAMS',
        fields: {
          code: 'INVALID_API_VERSION',
        },
      });

    if (Object.values(PI_TYPES).indexOf(type) < 0)
      throw new X({
        status: 400,
        code: 'INVALID_REQUEST_PARAMS',
        fields: {
          code: 'INVALID_STRIPE_WEBHOOK_TYPE',
          value: type,
        },
      });
  }

  authenticate(headers, body, rawBody) {
    const signature = headers['stripe-signature'];

    try {
      return stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      throw new X({
        status: 401,
        code: 'INVALID_REQUEST',
        fields: {
          code: 'STRIPE_SIGNATURE_MISMATCH',
        },
      });
    }
  }

  getWebhookIdentifier(webhookData) {
    return webhookData.id;
  }

  /**
   *
   * @param {object} options
   * @param {number} options.amount 12.3
   * @param {string} options.currency usd
   * @param {string} options.orderNumber FV36JF
   * @returns {Promise<any>}
   */
  async create(options) {
    const { amount, currency = 'usd', orderNumber } = options;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: new MathOp(amount).mul(100).toNumber(), // convert to cents
      currency,
      description: orderNumber,
      automatic_payment_methods: { enabled: true },
    });

    return {
      externalPaymentId: paymentIntent.id,
      secret: paymentIntent.client_secret,
      amount,
      currency,
    };
  }

  async cancel(id) {
    return stripe.paymentIntents.cancel(id);
  }

  async refund(id, amount = null) {
    const refundOptions = {
      payment_intent: id,
    };

    if (amount) {
      refundOptions.amount = new MathOp(amount).mul(100).toNumber();
    }

    return stripe.refunds.create(refundOptions);
  }

  async retrieveIntent(id) {
    return await stripe.paymentIntents.retrieve(id);
  }
}

export default new Stripe();
