import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';
import { Domain } from '../../models/Domain.mjs';
import { FreeAddress } from '../../models/FreeAddress.mjs';
import { ReferrerProfile } from '../../models/ReferrerProfile.mjs';

import logger from '../../logger.mjs';

import { handleUsersFreeCartItems } from '../../utils/cart.mjs';

export default class HandleUsersFreeCartItems extends Base {
  static get validationRules() {
    return {
      publicKey: ['string'],
      refCode: ['string'],
    };
  }

  async execute({ publicKey, refCode }) {
    try {
      const userId = this.context.id || null;
      const guestId = this.context.guestId || null;

      const where = {};
      if (userId) where.userId = userId;
      if (guestId) where.guestId = guestId;

      // todo: get active
      const cart = await Cart.findOne({ where });

      if (!cart) {
        return {
          data: { items: [] },
        };
      }

      const dashboardDomains = await Domain.getDashboardDomains();
      const allRefProfileDomains = refCode
        ? await ReferrerProfile.getRefDomainsList({
            refCode,
          })
        : [];

      const userHasFreeAddress =
        !publicKey && !userId
          ? []
          : await FreeAddress.getItems({
              publicKey,
              userId,
            });

      const handledFreeCartItems = handleUsersFreeCartItems({
        allRefProfileDomains,
        cartItems: cart.items,
        dashboardDomains,
        userHasFreeAddress,
        refCode,
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
