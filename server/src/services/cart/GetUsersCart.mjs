import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

export default class GetUsersCart extends Base {
  async execute() {
    const userId = this.context.id;
    try {
      const cart = await Cart.findOneWhere({ userId });

      return {
        data: cart ? Cart.format(cart.get({ plain: true })) : { items: [] },
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'GET_USERS_CART',
        fields: {
          cart: 'GET_USERS_CART_ERROR',
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
