import { makeServiceRunner } from '../tools';

import OrdersCreate from '../services/orders/Create';
import OrderProcessPayment from '../services/orders/ProcessPayment.mjs';
import OrderUpdatePubKey from '../services/orders/UpdatePubKey.mjs';
import OrdersList from '../services/orders/List';
import OrdersActive from '../services/orders/Active';
import OrdersGet from '../services/orders/Get';
import OrdersCancel from '../services/orders/Cancel.mjs';

export default {
  list: makeServiceRunner(OrdersList, req => req.query),
  create: makeServiceRunner(OrdersCreate, req => req.body),
  updatePubKey: makeServiceRunner(OrderUpdatePubKey, req => req.body),
  processPayment: makeServiceRunner(OrderProcessPayment, req => req.body),
  getActive: makeServiceRunner(OrdersActive, req => req.query),
  get: makeServiceRunner(OrdersGet, req => req.params),
  cancel: makeServiceRunner(OrdersCancel),
};
