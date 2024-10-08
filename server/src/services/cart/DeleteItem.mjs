import Base from '../Base.mjs';
import X from '../Exception.mjs';

import { Cart } from '../../models/Cart.mjs';
import { Domain } from '../../models/Domain.mjs';
import { FreeAddress } from '../../models/FreeAddress.mjs';
import { ReferrerProfile } from '../../models/ReferrerProfile.mjs';

import logger from '../../logger.mjs';

import {
  handleFreeCartDeleteItem,
  handleFioHandleCartItemsWithCustomDomain,
  handlePrices,
} from '../../utils/cart.mjs';

export default class DeleteItem extends Base {
  static get validationRules() {
    return {
      itemId: ['required', 'string'],
      prices: [
        {
          nested_object: {
            addBundles: ['string'],
            address: ['string'],
            domain: ['string'],
            renewDomain: ['string'],
          },
        },
      ],
      roe: ['string'],
      refCode: ['string'],
    };
  }

  async execute({ itemId, prices, roe, refCode }) {
    const userId = this.context.id || null;
    const guestId = this.context.guestId || null;

    const where = {};
    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    try {
      const cart = await Cart.findOne({ where });

      if (!cart) {
        return { data: { items: [] } };
      }

      const dashboardDomains = await Domain.getDashboardDomains();
      const allRefProfileDomains = refCode
        ? await ReferrerProfile.getRefDomainsList({
            refCode,
          })
        : [];

      const publicKey = cart.publicKey;

      const userHasFreeAddress =
        !publicKey && !userId
          ? []
          : await FreeAddress.getItems({
              publicKey,
              userId,
            });

      const { handledPrices, handledRoe } = await handlePrices({
        prices,
        roe,
      });

      const {
        addBundles: addBundlesPrice,
        address: addressPrice,
        domain: domainPrice,
        renewDomain: renewDomainPrice,
      } = handledPrices;

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

      if (!handledRoe) {
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
        allRefProfileDomains,
        cartItems: items,
        dashboardDomains,
        existingItem,
        userHasFreeAddress,
        refCode,
      });

      const handledCartItemsWithExistingFioHandleCustomDomain = handleFioHandleCartItemsWithCustomDomain(
        {
          cartItems: updatedItems,
          item: existingItem,
          prices: handledPrices,
          roe: handledRoe,
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
        await Cart.destroy({ where });
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
