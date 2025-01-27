import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models';

import logger from '../../logger.mjs';

import { handleFreeItems } from '../../utils/cart.mjs';
import { getExistUsersByPublicKeyOrCreateNew } from '../../utils/user.mjs';

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

      const cart = await Cart.getActive({ userId, guestId });

      if (!cart) {
        return {
          data: { items: [] },
        };
      }

      let noProfileResolvedUser = null;
      if (!userId && publicKey) {
        const [resolvedUser] = await getExistUsersByPublicKeyOrCreateNew(
          publicKey,
          refCode,
        );
        noProfileResolvedUser = resolvedUser;
      }

      const {
        userRefProfile,
        dashboardDomains,
        allRefProfileDomains,
        freeDomainToOwner,
        userHasFreeAddress,
      } = await Cart.getDataForCartItemsUpdate({
        refCode,
        noProfileResolvedUser,
        publicKey,
        userId,
        items: cart.items,
      });

      const handledFreeCartItems = handleFreeItems({
        allRefProfileDomains,
        cartItems: cart.items,
        dashboardDomains,
        freeDomainToOwner,
        userHasFreeAddress,
        userRefCode: userRefProfile && userRefProfile.code,
      });

      await cart.update({
        items: handledFreeCartItems,
        userId,
        publicKey: noProfileResolvedUser ? publicKey : null,
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
