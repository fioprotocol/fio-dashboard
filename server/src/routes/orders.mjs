import { makeServiceRunner } from '../tools';

import OrdersCreate from '../services/orders/Create';
import OrdersUpdate from '../services/orders/Update';
import OrdersList from '../services/orders/List';
import OrdersActive from '../services/orders/Active';
import OrdersGet from '../services/orders/Get';

export default {
  list: makeServiceRunner(OrdersList, req => req.query),
  create: makeServiceRunner(OrdersCreate, req => ({ ...req.body, cookies: req.cookies })),
  update: makeServiceRunner(OrdersUpdate, req => ({ ...req.params, ...req.body })),
  getActive: makeServiceRunner(OrdersActive, req => req.query),
  get: makeServiceRunner(OrdersGet, req => req.params),
};
