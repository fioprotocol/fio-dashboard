import { makeServiceRunner } from '../tools';

import PaymentsCreate from '../services/payments/Create';
import PaymentsWebhook from '../services/payments/Webhook';

export default {
  create: makeServiceRunner(PaymentsCreate, req => req.body),
  webhook: makeServiceRunner(PaymentsWebhook, req => ({
    body: req.body,
    headers: req.headers,
    hostname: req.hostname,
    rawBody: req.rawBody,
  })),
};
