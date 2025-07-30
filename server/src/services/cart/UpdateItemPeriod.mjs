import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

import { handlePriceForMultiYearItems, convertFioPrices } from '../../utils/cart.mjs';

import { CART_ITEM_TYPE, DOMAIN_RENEW_PERIODS } from '../../config/constants';

export default class UpdateItemPeriod extends Base {
  static get validationRules() {
    return {
      itemId: ['required', 'string'],
      period: ['required', 'integer', { one_of: DOMAIN_RENEW_PERIODS }],
    };
  }

  async execute({ itemId, period }) {
    try {
      const userId = this.context.id || null;
      const guestId = this.context.guestId || null;

      const cart = await Cart.getActive({ userId, guestId });

      const existingCartItem = cart.items.find(cartItem => cartItem.id === itemId);

      if (!existingCartItem) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            cartItem: 'NOT_FOUND_PERIOD_ITEM',
          },
        });
      }

      const { prices, roe } = cart.options;

      const {
        addBundles: addBundlesPrice,
        address: addressPrice,
        domain: domainPrice,
        combo: comboPrice,
        renewDomain: renewDomainPrice,
      } = prices;

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

      if (!roe) {
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
        onlyRenew: existingCartItem.type === CART_ITEM_TYPE.DOMAIN_RENEWAL,
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
