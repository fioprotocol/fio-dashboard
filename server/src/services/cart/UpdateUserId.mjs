import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

export default class UpdateUserId extends Base {
  static get validationRules() {
    return {
      cartId: ['required', 'string'],
      userId: ['string'],
    };
  }

  async execute({ cartId, userId }) {
    try {
      await Cart.update({ userId }, { where: { id: cartId } });
      return {
        data: { success: true },
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_UPDATE_ERROR',
        fields: {
          setOldCart: 'CANNOT_UPDATE_USER_ID',
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
