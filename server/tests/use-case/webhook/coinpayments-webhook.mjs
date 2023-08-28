import crypto from 'crypto';

import superagent from 'superagent';

import config from '../../../src/config';
import { COIN_PAYMENTS_STATUSES } from '../../../src/external/payment-processor/coinpayments.mjs';

// create webhook-options.json and set your values to send proper webhooks for your scenario
// example
// {
//   "email": "andreyvtest11l@eze.tech",
//   "orderNumber": "9D2G5ZK",
//   "defaultTxnId": "CPGF2ULMQ3WOYEC8TQWQK1ANOI",
//   "defaultIpnId": "eb6a4c5929005c51c3841599c3cbb085",
//   "total": "1.73",
//   "total2": "0.03391",
//   "currency2": "LTCT",
//   "lastWebhook": {
//     "defaultIpnId": "efe330d443647e8971431499763f071d",
//     "total2": "0.03391",
//     "net": "0.03374",
//     "received": "0.03391",
//     "status": 100 // completed, check COIN_PAYMENTS_STATUSES
//   }
// }
import webhooksOptions from './webhook-options.json';

class Api {
  constructor() {
    this.baseurl = `http://localhost:${config.port}/api/v1/`;
  }

  request({ url, method, params, body, token, headers }) {
    const req = superagent[method](`${this.baseurl}${url}`);

    if (token) req.set('Authorization', `Bearer ${token}`);
    if (headers) {
      for (const headerName in headers) {
        req.set(headerName, headers[headerName]);
      }
    }
    if (params) req.query(params);
    if (body) req.send(body);

    return req.then(res => {
      if (!res.status) throw res.body.error;
      return res.body;
    });
  }
}

const api = new Api();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getRawBody = body => {
  let rawData = '';
  for (const key in body) {
    if (!rawData) {
      rawData += `${key}=${body[key]}`;
      continue;
    }

    rawData += `&${key}=${encodeURIComponent(body[key])}`; // todo: check if we need replace %20 on real webhook - .replace(/%20/g, '+')
  }

  return rawData;
};

const generateWebhookHmac = rawBody => {
  return crypto
    .createHmac('sha512', process.env.COIN_PAYMENTS_SECRET)
    .update(rawBody)
    .digest('hex');
};

const paymentWebhook = async ({
  email,
  orderNumber,
  defaultIpnId,
  defaultTxnId,
  total,
  total2,
  currency2,
  status = COIN_PAYMENTS_STATUSES.WAITING,
  net = null,
  received = 0,
}) => {
  const ipnId =
    defaultIpnId ||
    crypto
      .createHmac('sha1', `ipn_id_${Math.random()}`)
      .update(orderNumber)
      .digest('hex');
  const txnId =
    defaultTxnId ||
    crypto
      .createHmac('sha1', `txn_id_${Math.random()}`)
      .update(orderNumber)
      .digest('hex');

  const body = {
    amount1: total,
    amount2: total2,
    currency1: 'USDT',
    currency2,
    email: email,
    fee: '0.00017',
    first_name: 'Test First Name',
    invoice: orderNumber,
    ipn_id: ipnId,
    ipn_mode: 'hmac',
    ipn_type: 'simple',
    ipn_version: '1.0',
    item_amount: '1.73',
    item_desc: 'FIO Handles: ...',
    item_name: 'FIO Dashboard cart',
    last_name: 'Test Last Name',
    merchant: process.env.COIN_PAYMENTS_MERCHANT_ID,
    received_amount: received,
    received_confirms: 0,
    shipping: 0,
    status,
    status_text: '-',
    subtotal: total,
    tax: 0,
    txn_id: txnId,
  };

  if (net) body.net = net;

  const res = await api.request({
    headers: {
      connection: 'close',
      'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      hmac: generateWebhookHmac(getRawBody(body)),
      accept: '*/*',
      'user-agent': 'CoinPayments.net IPN Generator',
      host: '',
    },
    url: '/payments/webhook/',
    method: 'post',
    body,
  });

  if (res.status === 0 && res.error) {
    // leave for debug reasons
    // eslint-disable-next-line no-console
    console.log(res);
    throw new Error(res.error.code);
  }

  return body;
};

const executePaymentEvents = async () => {
  // pending
  const { txn_id } = await paymentWebhook(webhooksOptions);

  await sleep(5000);

  // last status
  await paymentWebhook({
    ...webhooksOptions,
    defaultTxnId: txn_id,
    ...webhooksOptions.lastWebhook,
  });
};

executePaymentEvents();
