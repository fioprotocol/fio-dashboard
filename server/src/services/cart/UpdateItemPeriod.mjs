import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

export default class UpdateItemPeriod extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
      itemId: ['required', 'string'],
      period: ['required', 'number'],
    };
  }

  async execute({ id, itemId, period }) {
    try {
      const cart = await Cart.findById(id);

      const updatedItems = cart.items.map(cartItem => {
        if (cartItem.id === itemId) {
          cartItem.period = period;
          return cartItem;
        } else {
          return cartItem;
        }
      });

      await cart.update({ items: updatedItems });

      return {
        data: Cart.format(cart.get({ plain: true })),
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_UPDATE_ERROR',
        fields: {
          cartItem: 'CANNOT_UPDATE_ITEM_PERIOD',
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
