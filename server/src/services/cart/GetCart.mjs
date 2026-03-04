import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';
import { Order } from '../../models/Order.mjs';

import { getCartWarnings } from '../../utils/order-validation.mjs';

import logger from '../../logger.mjs';

export default class GetCart extends Base {
  async execute() {
    const userId = this.context.id || null;
    const guestId = this.context.guestId || null;

    if (!userId && !guestId) return { data: { items: [] } };

    try {
      const cart = await Cart.getActive({ userId, guestId });
      if (!cart) return { data: { items: [] } };

      const cartData = Cart.format(cart.get({ plain: true }));

      let warnings = null;
      if (userId && cartData.items && cartData.items.length) {
        const activeOrderItems = await Order.getActiveOrderItemsByUser({ userId });
        warnings = await getCartWarnings({
          cartItems: cartData.items,
          activeOrderItems,
        });
      }

      return {
        data: { ...cartData, warnings },
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
