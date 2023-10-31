import MathOp from 'big.js';

import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

import { convertFioPrices, handlePriceForMultiYearItems } from '../../utils/cart.mjs';

import { CART_ITEM_TYPE } from '../../config/constants';

export default class RecalculateOnPriceUpdate extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
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

  async execute({ id, prices, roe }) {
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

      const cartItemsWithRecalculatedPrices = cart.items.map(cartItem => {
        const { type, period } = cartItem;
        const { addBundles, address, renewDomain } = prices;

        let nativeFioAmount = null;

        switch (type) {
          case CART_ITEM_TYPE.ADD_BUNDLES:
            nativeFioAmount = addBundles;
            break;
          case CART_ITEM_TYPE.ADDRESS:
            nativeFioAmount = address;
            break;
          case CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN:
            nativeFioAmount = handlePriceForMultiYearItems({
              includeAddress: true,
              prices,
              period,
            });
            break;
          case CART_ITEM_TYPE.DOMAIN:
            nativeFioAmount = handlePriceForMultiYearItems({
              includeAddress: false,
              prices,
              period,
            });
            break;
          case CART_ITEM_TYPE.DOMAIN_RENEWAL:
            nativeFioAmount = new MathOp(renewDomain).mul(period).toNumber();
            break;
          default:
            nativeFioAmount = null;
        }

        const { fio, usdc } = convertFioPrices(nativeFioAmount, roe);

        if (!nativeFioAmount) {
          throw new X({
            code: 'NO_NATIVE_FIO_AMOUNT',
            fields: {
              updateCartItemPrice: 'NO_NATIVE_FIO_AMOUNT',
            },
          });
        }

        return {
          ...cartItem,
          costNativeFio: nativeFioAmount,
          costFio: fio,
          costUsdc: usdc,
        };
      });

      await cart.update({ items: cartItemsWithRecalculatedPrices });

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
