import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

export default class SetOldCart extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
    };
  }

  async execute({ id }) {
    try {
      await Cart.update({ isOldCart: true }, { where: { id } });
      return {
        data: { success: true },
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_UPDATE_ERROR',
        fields: {
          setOldCart: 'CANNOT_SET_OLD_CART',
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
