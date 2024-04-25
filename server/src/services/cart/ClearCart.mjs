import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

export default class ClearCart extends Base {
  static get validationRules() {
    return {
      id: ['string'],
    };
  }

  async execute({ id }) {
    try {
      if (id) {
        await Cart.destroy({ where: { id } });
      }

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
