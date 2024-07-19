import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';
import { Domain } from '../../models/Domain.mjs';
import { FreeAddress } from '../../models/FreeAddress.mjs';
import { ReferrerProfile } from '../../models/ReferrerProfile.mjs';

import logger from '../../logger.mjs';

import { handleUsersFreeCartItems } from '../../utils/cart.mjs';

import config from '../../config/index.mjs';

export default class HandleUsersFreeCartItems extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
      userId: ['string'],
      publicKey: ['string'],
      cookies: ['any_object'],
    };
  }

  async execute({ id, userId, publicKey, cookies }) {
    try {
      const cart = await Cart.findById(id);

      if (!cart) {
        return {
          data: { items: [] },
        };
      }

      const refCookie = cookies && cookies[config.refCookieName];

      const dashboardDomains = await Domain.getDashboardDomains();
      const allRefProfileDomains = await ReferrerProfile.getRefDomainsList({
        refCode: refCookie,
      });
      const userHasFreeAddress = publicKey
        ? await FreeAddress.getItems({ publicKey })
        : userId
        ? await FreeAddress.getItems({
            userId,
          })
        : null;

      const handledFreeCartItems = handleUsersFreeCartItems({
        allRefProfileDomains,
        cartItems: cart.items,
        dashboardDomains,
        userHasFreeAddress,
        refCode: refCookie,
      });

      await cart.update({
        items: handledFreeCartItems,
        userId,
        publicKey,
      });

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
