import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';
import { Domain } from '../../models/Domain.mjs';
import { FreeAddress } from '../../models/FreeAddress.mjs';

import logger from '../../logger.mjs';

import { handleFreeCartDeleteItem } from '../../utils/cart.mjs';

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

      const userId = this.context.id || null;
      const dashboardDomains = await Domain.getDashboardDomains();

      const userHasFreeAddress =
        userId &&
        (await FreeAddress.getItem({
          userId,
        }));

      const items = cart.items;

      const existingItem = items.find(item => item.id === itemId);

      const updatedItems = handleFreeCartDeleteItem({
        cartItems: items,
        dashboardDomains,
        existingItem,
        userHasFreeAddress,
      });

      if (updatedItems.length > 0) {
        await cart.update({ items: updatedItems });

        return {
          data: Cart.format(cart.get({ plain: true })),
        };
      } else {
        await Cart.destroy({ where: { id } });
        return { data: { items: [] } };
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
