import { Client, Env, Currency, Models, Tokens, InvoiceStatus } from 'bitpay-sdk';

import PaymentProcessor from './base.mjs';

import { PAYMENT_EVENT_STATUSES, PAYMENTS_STATUSES } from '../../config/constants.js';
import config from '../../config';

import MathOp from '../../services/math.mjs';

const BITPAY_USER_AGENT = 'Webhook-BitPay support@bitpay.com';

class BitPay extends PaymentProcessor {
  constructor() {
    super();
    this.bitPayClient = null;
  }

  async getBitPayClient() {
    if (!this.bitPayClient) {
      const tokens = Tokens;
      tokens.merchant = process.env.BITPAY_API_TOKEN;

      this.bitPayClient = await new Client(
        null,
        process.env.IS_BITPAY_TEST_ENV ? Env.Test : Env.Prod,
        process.env.BITPAY_PRIVATE_KEY,
        tokens,
      );

      return this.bitPayClient;
    }

    return this.bitPayClient;
  }

  checkEvent() {
    // We don't neeed to check event beacuse we get invoice data from get request not from webhook beacuse it is not trusted
    return false;
  }

  isWebhook(hostname, userAgent) {
    const checkRegex = new RegExp(BITPAY_USER_AGENT, 'i');
    return checkRegex.exec(userAgent);
  }

  async getWebhookData(body) {
    const { data: dataObject } = body;
    const { id } = dataObject;

    const bitPayClient = await this.getBitPayClient();

    const bitPayInvoice = await bitPayClient.GetInvoice(id);

    const {
      amountPaid,
      buyerProvidedEmail,
      currency,
      expirationTime,
      guid: paymentId,
      orderId: orderNumber,
      price,
      status,
      transactions,
      token,
    } = bitPayInvoice;

    const data = {
      id,
      amountPaid,
      currency,
      email: buyerProvidedEmail,
      expirationTime,
      orderNumber,
      price,
      paymentId,
      status,
      transactions,
      txn_id: id,
      token,
    };

    return data;
  }

  getWebhookMeta(data) {
    return {
      ...super.getWebhookMeta(data),
      type: data.type,
    };
  }

  getWebhookIdentifier(webhookData) {
    return webhookData.id;
  }

  isCompleted(status) {
    return status === InvoiceStatus.Complete;
  }

  mapPaymentStatus(bitPayStatus) {
    if (this.isCompleted(bitPayStatus)) {
      return {
        payment: PAYMENTS_STATUSES.COMPLETED,
        event: PAYMENT_EVENT_STATUSES.SUCCESS,
      };
    }

    switch (bitPayStatus) {
      case InvoiceStatus.New:
        return {
          payment: PAYMENTS_STATUSES.NEW,
          event: PAYMENT_EVENT_STATUSES.PENDING,
        };
      case InvoiceStatus.Invalid:
        return {
          payment: PAYMENTS_STATUSES.CANCELLED,
          event: PAYMENT_EVENT_STATUSES.CANCEL,
        };
      case InvoiceStatus.Expired:
        return {
          payment: PAYMENTS_STATUSES.EXPIRED,
          event: PAYMENT_EVENT_STATUSES.EXPIRED,
        };
      case InvoiceStatus.Paid:
        return {
          payment: PAYMENTS_STATUSES.PENDING,
          event: PAYMENT_EVENT_STATUSES.PENDING,
        };
      default:
        return {
          payment: PAYMENTS_STATUSES.PENDING,
          event: PAYMENT_EVENT_STATUSES.PENDING,
        };
    }
  }

  /**
   *
   * @param {object} options
   * @param {number} options.amount 12.3
   * @param {string} options.currency usd
   * @param {string} options.orderNumber FV36JF
   * @param {string} options.buyer 'user@email'
   * @returns {Promise<any>}
   */
  async create(options) {
    const { amount, buyer, currency = Currency.USD, orderNumber } = options;

    const bitPayClient = await this.getBitPayClient();

    const host = config.mainUrl;

    const invoiceData = new Models.Invoice(amount, currency);
    invoiceData.orderId = orderNumber;
    invoiceData.buyer = { email: buyer };
    invoiceData.redirectURL = `${host}order-details?orderNumber=${orderNumber}`;
    invoiceData.notificationURL = `${host}api/v1/payments/webhook/`;

    const paymentIntent = await bitPayClient.CreateInvoice(invoiceData);

    return {
      externalPaymentId: paymentIntent.id,
      secret: paymentIntent.billId,
      amount,
      currency,
    };
  }

  async cancel(id) {
    const bitPayClient = await this.getBitPayClient();

    return await bitPayClient._RESTcli.delete(`invoices/${id}`, {
      token: process.env.BITPAY_API_TOKEN,
    });
  }

  authenticate(headers, body) {
    // BitPay webhook is not trusted and has no any authentiation method
    return body;
  }

  async refund(id, amount = null) {
    const bitPayClient = await this.getBitPayClient();
    const bitPayInvoice = await bitPayClient.GetInvoice(id);

    return await bitPayClient.CreateRefund(
      bitPayInvoice,
      new MathOp(amount).toNumber(),
      bitPayInvoice.currency,
    );
  }
}

export default new BitPay();
