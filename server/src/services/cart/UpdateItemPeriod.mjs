import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

import { handlePriceForMultiYearItems, convertFioPrices } from '../../utils/cart.mjs';

import { CART_ITEM_TYPE } from '../../config/constants';

export default class UpdateItemPeriod extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
      itemId: ['required', 'string'],
      period: ['required', 'string'],
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
    };
  }

  async execute({ id, itemId, period, prices, roe }) {
    try {
      const cart = await Cart.findById(id);

      const existingCartItem = cart.items.find(cartItem => cartItem.id === itemId);

      if (!existingCartItem) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            cartItem: 'NOT_FOUND_PERIOD_ITEM',
          },
        });
      }

      const updatedMultiYearPrice = handlePriceForMultiYearItems({
        includeAddress:
          existingCartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN,
        period,
        prices,
        roe,
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
