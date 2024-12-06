import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import { fioApi } from '../../external/fio.mjs';
import { getROE } from '../../external/roe.mjs';

import logger from '../../logger.mjs';

import { recalculateCartItems } from '../../utils/cart.mjs';

export default class RecalculateOnPriceUpdate extends Base {
  async execute() {
    try {
      const userId = this.context.id || null;
      const guestId = this.context.guestId || null;

      const where = {};
      if (userId) where.userId = userId;
      if (guestId) where.guestId = guestId;

      // todo: get active
      const cart = await Cart.findOne({ where });

      if (!cart) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            cart: 'NOT_FOUND',
          },
        });
      }
      const prices = await fioApi.getPrices();
      const roe = await getROE();

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

      let cartItemsWithRecalculatedPrices = [];
      try {
        cartItemsWithRecalculatedPrices = recalculateCartItems({
          items: cart.items,
          prices,
          roe,
        });
      } catch (err) {
        if (err.message === 'NO_NATIVE_FIO_AMOUNT') {
          throw new X({
            code: 'NO_NATIVE_FIO_AMOUNT',
            fields: {
              updateCartItemPrice: 'NO_NATIVE_FIO_AMOUNT',
            },
          });
        }

        throw err;
      }

      await cart.update({
        items: cartItemsWithRecalculatedPrices,
        options: { prices, roe, updatedAt: new Date() },
      });

      return {
        data: Cart.format(cart.get({ plain: true })),
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_UPDATE',
        fields: {
          recalculatePrice: 'CANNOT_HANDLE_FREE_CART_ITEMS',
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
