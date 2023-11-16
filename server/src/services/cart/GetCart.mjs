import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

export default class GetCart extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
    };
  }

  async execute({ id }) {
    try {
      const cart = await Cart.findById(id);

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
