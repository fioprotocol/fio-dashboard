import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

export default class GetCart extends Base {
  async execute() {
    const userId = this.context.id || null;
    const guestId = this.context.guestId || null;

    const where = {};
    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    try {
      const cart = await Cart.findOne({ where });

      return {
        data: cart ? Cart.format(cart.get({ plain: true })) : { items: [] },
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'GET_CART',
        fields: {
          cart: 'GET_CART_ERROR',
        },
      });
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
