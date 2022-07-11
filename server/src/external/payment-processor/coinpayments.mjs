import crypto from 'crypto';

import PaymentProcessor from './base.mjs';
import { PAYMENT_EVENT_STATUSES, PAYMENTS_STATUSES } from '../../config/constants.js';
import X from '../../services/Exception.mjs';

export const COIN_PAYMENTS_STATUSES = {
  PAYPAL_REFUND: -2,
  CANCELLED_TIMED_OUT: -1,
  WAITING: 0,
  CONFIRMED: 1,
  QUEUED_NIGHTLY: 2,
  PAYPAL_PENDING: 3,
  COMPLETED: 100,
};
const IPN_TYPES = {
  simple: 'simple',
  button: 'button',
  cart: 'cart',
  donation: 'donation',
  deposit: 'deposit',
  withdrawal: 'withdrawal',
  api: 'api',
};
const COIN_PAYMENTS_DOMAIN = 'www.coinpayments.net';
const COIN_PAYMENTS_USER_AGENT = 'CoinPayments.net IPN Generator';

class CoinPayments extends PaymentProcessor {
  constructor() {
    super();
  }

  isWebhook(hostname, userAgent) {
    const checkRegex = new RegExp(`${COIN_PAYMENTS_DOMAIN}`, 'i');
    return checkRegex.exec(hostname) || userAgent === COIN_PAYMENTS_USER_AGENT;
  }

  getWebhookData(body) {
    const { ipn_id, ipn_type } = body;
    let data = { ipn_id };

    if (ipn_type === IPN_TYPES.deposit) {
      const {
        deposit_id, // unique ID assigned by CoinPayments for this payment. This can be used for duplicate/uniqueness checking since it is possible to have multiple deposits with the same TXID but to different addresses in some coins.
        txn_id,
        address, // Coin address the payment was received on.
        status,
        status_text,
        currency,
        amount,
        fee,
        fiat_coin,
        fiat_amount,
        fiat_fee,
      } = body;

      data = {
        ...data,
        deposit_id,
        txn_id,
        address,
        status,
        status_text,
        currency,
        amount,
        fee,
        fiat_coin,
        fiat_amount,
        fiat_fee,
      };
    }

    if (ipn_type === IPN_TYPES.simple) {
      const {
        email,
        txn_id,
        status,
        status_text,
        currency1, // The original currency/coin submitted in your button.
        currency2, // The coin the buyer chose to pay with.
        amount1, // The total amount of the payment in your original currency/coin.
        amount2, // The total amount of the payment in the buyer's selected coin.
        net, // The net amount you received of the buyer's selected coin after our fee and any coin TX fees to send the coins to you.
        fee,
        item_name,
        item_desc,
        item_number,
        invoice,
        custom,
        send_tx, // The TX ID of the payment to the merchant. Only included when 'status' >= 100 and if the payment mode is set to ASAP or Nightly or if the payment is PayPal Passthru.
      } = body;

      data = {
        ...data,
        email,
        txn_id,
        status,
        status_text,
        currency1,
        currency: currency2,
        amount1,
        amount: amount2,
        net,
        fee,
        item_name,
        item_desc,
        orderNumber: item_number || invoice,
        invoice,
        custom,
        send_tx,
      };
    }

    return data;
  }

  isCompleted(status) {
    return (
      status >= COIN_PAYMENTS_STATUSES.COMPLETED ||
      status === COIN_PAYMENTS_STATUSES.QUEUED_NIGHTLY
    );
  }

  mapPaymentStatus(coinPaymentsStatus) {
    if (this.isCompleted(coinPaymentsStatus)) {
      return {
        payment: PAYMENTS_STATUSES.COMPLETED,
        event: PAYMENT_EVENT_STATUSES.SUCCESS,
      };
    }

    if (coinPaymentsStatus < COIN_PAYMENTS_STATUSES.WAITING)
      return {
        payment: PAYMENTS_STATUSES.CANCELLED,
        event: PAYMENT_EVENT_STATUSES.CANCEL,
      };

    if (coinPaymentsStatus >= COIN_PAYMENTS_STATUSES.WAITING)
      return {
        payment: PAYMENTS_STATUSES.PENDING,
        event: PAYMENT_EVENT_STATUSES.PENDING,
      };
  }

  validate(headers, body) {
    if (!headers || !headers.hmac)
      throw new X({
        code: 'INVALID_REQUEST_PARAMS',
        fields: {
          code: 'INVALID_REQUEST_HEADERS',
        },
      });

    const { merchant } = body;

    if (!merchant || merchant !== process.env.COIN_PAYMENTS_MERCHANT_ID)
      throw new X({
        code: 'INVALID_REQUEST_PARAMS',
        fields: {
          code: 'INVALID_MERCHANT',
        },
      });
  }

  authenticate(headers, body, rawBody) {
    const bodyHmac = crypto
      .createHmac('sha512', process.env.COIN_PAYMENTS_SECRET)
      .update(rawBody)
      .digest('hex');

    if (headers.hmac !== bodyHmac)
      throw new X({
        code: 'INVALID_REQUEST',
        fields: {
          code: 'HMAC_SIGNATURE_MISMATCH',
        },
      });

    return body;
  }

  getWebhookIdentifier(webhookData) {
    return webhookData.ipn_id;
  }
}

export default new CoinPayments();
