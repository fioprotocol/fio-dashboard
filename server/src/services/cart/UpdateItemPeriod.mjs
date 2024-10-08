import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

import {
  handlePriceForMultiYearItems,
  convertFioPrices,
  handlePrices,
} from '../../utils/cart.mjs';

import { CART_ITEM_TYPE } from '../../config/constants';

export default class UpdateItemPeriod extends Base {
  static get validationRules() {
    return {
      itemId: ['required', 'string'],
      period: ['required', 'string'],
      prices: [
        {
          nested_object: {
            addBundles: ['string'],
            address: ['string'],
            domain: ['string'],
            renewDomain: ['string'],
            combo: ['string'],
          },
        },
      ],
      roe: ['string'],
    };
  }

  async execute({ itemId, period, prices, roe }) {
    try {
      const userId = this.context.id || null;
      const guestId = this.context.guestId || null;

      const where = {};
      if (userId) where.userId = userId;
      if (guestId) where.guestId = guestId;

      const cart = await Cart.findOne({ where });

      const existingCartItem = cart.items.find(cartItem => cartItem.id === itemId);

      if (!existingCartItem) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            cartItem: 'NOT_FOUND_PERIOD_ITEM',
          },
        });
      }

      const { handledPrices, handledRoe } = await handlePrices({
        prices,
        roe,
      });

      const {
        addBundles: addBundlesPrice,
        address: addressPrice,
        domain: domainPrice,
        combo: comboPrice,
        renewDomain: renewDomainPrice,
      } = handledPrices;

      const isEmptyPrices =
        !addBundlesPrice ||
        !addressPrice ||
        !domainPrice ||
        !comboPrice ||
        !renewDomainPrice;

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

      const updatedMultiYearPrice = handlePriceForMultiYearItems({
        includeAddress:
          existingCartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN,
        period,
        prices: handledPrices,
        roe: handledRoe,
      });

      const { fio, usdc } = convertFioPrices(updatedMultiYearPrice, roe);

      const cartItems = cart.items.map(cartItem =>
        cartItem.id === existingCartItem.id
          ? {
              ...cartItem,
              period,
              costNativeFio: updatedMultiYearPrice,
              costFio: fio,
              costUsdc: usdc,
            }
          : cartItem.hasCustomDomainInCart && cartItem.domain === existingCartItem.domain
          ? {
              ...cartItem,
              period,
            }
          : cartItem,
      );

      await cart.update({ items: cartItems });

      return {
        data: Cart.format(cart.get({ plain: true })),
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_UPDATE_ERROR',
        fields: {
          cartItem: 'CANNOT_UPDATE_ITEM_PERIOD',
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
