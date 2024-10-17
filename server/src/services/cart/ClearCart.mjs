import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

export default class ClearCart extends Base {
  async execute() {
    const userId = this.context.id || null;
    const guestId = this.context.guestId || null;

    const where = {};
    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    try {
      await Cart.destroy({ where });

      return {
        data: { success: true },
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_CLEAR',
        fields: {
          deleteItem: 'CANNOT_CLEAR_CART',
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
