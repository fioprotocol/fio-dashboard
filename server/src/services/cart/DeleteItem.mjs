import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';
import { Domain } from '../../models/Domain.mjs';
import { FreeAddress } from '../../models/FreeAddress.mjs';
import { ReferrerProfile } from '../../models/ReferrerProfile.mjs';

import logger from '../../logger.mjs';

import {
  handleFreeCartDeleteItem,
  handleFioHandleCartItemsWithCustomDomain,
} from '../../utils/cart.mjs';

export default class DeleteItem extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
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
      userId: ['string'],
    };
  }

  async execute({ id, itemId, prices, roe, userId }) {
    try {
      const cart = await Cart.findById(id);

      if (!cart) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            cart: 'NOT_FOUND',
          },
        });
      }

      const dashboardDomains = await Domain.getDashboardDomains();
      const allRefProfileDomains = await ReferrerProfile.getRefDomainsList();

      const userHasFreeAddress =
        userId &&
        (await FreeAddress.getItem({
          userId,
        }));

      const items = cart.items;

      const existingItem = items.find(item => item.id === itemId);

      const updatedItems = handleFreeCartDeleteItem({
        cartItems: items,
        dashboardDomains: [...dashboardDomains, ...allRefProfileDomains],
        existingItem,
        userHasFreeAddress,
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
        await Cart.destroy({ where: { id } });
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
