import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';
import { Domain } from '../../models/Domain.mjs';
import { FioAccountProfile } from '../../models/FioAccountProfile.mjs';
import { FreeAddress } from '../../models/FreeAddress.mjs';

import logger from '../../logger.mjs';

import {
  handleFioHandleOnExistingCustomDomain,
  handleFreeCartAddItem,
} from '../../utils/cart.mjs';

export default class AddItem extends Base {
  static get validationRules() {
    return {
      id: ['string'],
      item: [
        'required',
        {
          nested_object: {
            address: ['string'],
            costFio: ['required', 'string'],
            costNativeFio: ['required', 'string'],
            costUsdc: ['required', 'string'],
            domain: ['required', 'string'],
            domainType: ['string'],
            id: ['required', 'string'],
            isFree: ['boolean'],
            period: ['string'],
            type: ['required', 'string'],
          },
        },
      ],
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

  async execute({ id, item, prices, roe, userId: reqUserId }) {
    try {
      const { domain } = item;

      const userId = this.context.id || reqUserId || null;

      const existingCart = await Cart.findById(id);

      const dashboardDomains = await Domain.getDashboardDomains();
      const freeDomainOwner = await FioAccountProfile.getDomainOwner(domain);
      const userHasFreeAddress =
        userId &&
        (await FreeAddress.getItem({
          userId,
        }));

      const handledFreeCartItem = handleFreeCartAddItem({
        cartItems: existingCart ? existingCart.items : [],
        dashboardDomains,
        freeDomainOwner,
        item,
        userHasFreeAddress,
      });

      if (!existingCart) {
        const cart = await Cart.create({
          items: [handledFreeCartItem],
          userId,
        });

        return { data: Cart.format(cart.get({ plain: true })) };
      }

      const items = existingCart.items;

      const handledCartItemsWithExistingCustomDomain = handleFioHandleOnExistingCustomDomain(
        {
          cartItems: items,
          newItem: handledFreeCartItem,
          prices,
          roe,
        },
      );

      await existingCart.update({
        items: handledCartItemsWithExistingCustomDomain,
        userId,
      });

      return {
        data: Cart.format(existingCart.get({ plain: true })),
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_UPDATE',
        fields: {
          addItem: 'CANNOT ADD CART ITEM',
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
