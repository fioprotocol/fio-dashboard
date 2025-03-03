import Base from '../Base.mjs';
import X from '../Exception.mjs';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

import {
  handleFreeCartDeleteItem,
  handleFioHandleCartItemsWithCustomDomain,
} from '../../utils/cart.mjs';
import { getExistUsersByPublicKeyOrCreateNew } from '../../utils/user.mjs';

export default class DeleteItem extends Base {
  static get validationRules() {
    return {
      itemId: ['required', 'string'],
      refCode: ['string'],
    };
  }

  async execute({ itemId, refCode }) {
    const userId = this.context.id || null;
    const guestId = this.context.guestId || null;

    try {
      const cart = await Cart.getActive({ userId, guestId });
      if (!cart) {
        return { data: { items: [] } };
      }

      const { prices, roe } = cart.options;

      const publicKey = cart.publicKey;

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
        domainsList,
        freeDomainToOwner,
        userHasFreeAddress,
        noAuth,
      } = await Cart.getDataForCartItemsUpdate({
        refCode,
        noProfileResolvedUser,
        publicKey,
        userId,
        items: cart.items,
      });

      const {
        addBundles: addBundlesPrice,
        address: addressPrice,
        domain: domainPrice,
        renewDomain: renewDomainPrice,
      } = prices;

      const isEmptyPrices =
        !addBundlesPrice || !addressPrice || !domainPrice || !renewDomainPrice;

      if (isEmptyPrices) {
        throw new X({
          code: 'ERROR',
          fields: {
            prices: 'PRICES_ARE_EMPTY',
          },
        });
      }

      if (!roe) {
        throw new X({
          code: 'ERROR',
          fields: {
            roe: 'ROE_IS_EMPTY',
          },
        });
      }

      const items = cart.items;

      const existingItem = items.find(item => item.id === itemId);

      const updatedItems = handleFreeCartDeleteItem({
        cartItems: items,
        domainsList,
        existingItem,
        freeDomainToOwner,
        userHasFreeAddress,
        userRefCode: userRefProfile && userRefProfile.code,
        noAuth,
      });

      const handledCartItemsWithExistingFioHandleCustomDomain = handleFioHandleCartItemsWithCustomDomain(
        {
          cartItems: updatedItems,
          item: existingItem,
          prices,
          roe,
        },
      );

      const cartItemWithoutDeletedItem = handledCartItemsWithExistingFioHandleCustomDomain.filter(
        cartItem => cartItem.id !== itemId,
      );

      if (cartItemWithoutDeletedItem.length > 0) {
        await cart.update({
          items: cartItemWithoutDeletedItem,
        });

        return {
          data: Cart.format(cart.get({ plain: true })),
        };
      } else {
        await cart.destroy();
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
