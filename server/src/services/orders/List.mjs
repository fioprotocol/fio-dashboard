import Base from '../Base';

import { Order } from '../../models';

export default class OrdersList extends Base {
  static get validationRules() {
    return {
      p: 'integer',
      s: 'string',
    };
  }

  async execute({ p, s }) {
    const orders = await Order.list(this.context.id, s, p);

    return {
      data: orders.map(order => Order.format(order.get({ plain: true }))),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
