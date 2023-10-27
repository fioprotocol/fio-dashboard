import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

import ClearCart from './ClearCart.mjs';

export default class DeleteItem extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
      itemId: ['required', 'string'],
    };
  }

  async execute({ id, itemId }) {
    try {
      const cart = await Cart.findById(id);

      if (!cart) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            cart: 'NOT_FOUND',
          },
        });
      }

      const items = cart.items;

      const updatedItems = items.filter(item => item.id !== itemId);

      if (updatedItems.length > 0) {
        await cart.update({ items: updatedItems });

        return {
          data: Cart.format(cart.get({ plain: true })),
        };
      } else {
        await ClearCart(id);
        return [];
      }
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_UPDATE',
        fields: {
          deleteItem: 'CANNOT_DELETE_CART_ITEM',
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
