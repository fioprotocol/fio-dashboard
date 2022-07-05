import { makeServiceRunner } from '../tools';

import PaymentsWebhook from '../services/payments/Webhook';

export default {
  webhook: makeServiceRunner(PaymentsWebhook, req => ({
    body: req.body,
    headers: req.headers,
    hostname: req.hostname,
    rawBody: req.rawBody,
  })),
};
