import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import { getCartOptions } from '../../utils/cart.mjs';

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
      if (!cart) return { data: { items: [] } };

      await getCartOptions(cart || { options: {} });

      return {
        data: Cart.format(cart.get({ plain: true })),
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
