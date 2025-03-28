import { makeServiceRunner } from '../tools';

import GenerateOrderPdf from '../services/orders/GenerateOrderPdf';

export default {
  createOrderPdf: makeServiceRunner(GenerateOrderPdf, req => req.body),
};
