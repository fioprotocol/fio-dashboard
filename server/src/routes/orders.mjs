import { makeServiceRunner } from '../tools';

import OrdersCreate from '../services/orders/Create';
import OrdersUpdate from '../services/orders/Update';
import OrdersList from '../services/orders/List';

export default {
  list: makeServiceRunner(OrdersList, req => req.params),
  create: makeServiceRunner(OrdersCreate, req => req.body),
  update: makeServiceRunner(OrdersUpdate, req => ({ ...req.params, ...req.body })),
};
