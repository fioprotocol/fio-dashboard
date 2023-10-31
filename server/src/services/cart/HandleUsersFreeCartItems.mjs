import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';
import { Domain } from '../../models/Domain.mjs';
import { FreeAddress } from '../../models/FreeAddress.mjs';

import logger from '../../logger.mjs';

import { handleUsersFreeCartItems } from '../../utils/cart.mjs';

export default class HandleUsersFreeCartItems extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
      userId: ['string'],
    };
  }

  async execute({ id, userId }) {
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

      const dashboardDomains = await Domain.getDashboardDomains();
      const userHasFreeAddress =
        userId &&
        (await FreeAddress.getItem({
          userId,
        }));

      const handledFreeCartItems = handleUsersFreeCartItems({
        cartItems: cart.items,
        dashboardDomains,
        userHasFreeAddress,
      });

      await cart.update({ items: handledFreeCartItems, userId });

      return {
        data: Cart.format(cart.get({ plain: true })),
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_UPDATE',
        fields: {
          freeCartItems: 'CANNOT_HANDLE_FREE_CART_ITEMS',
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
