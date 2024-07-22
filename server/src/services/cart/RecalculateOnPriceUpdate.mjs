import MathOp from 'big.js';

import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

import {
  convertFioPrices,
  handlePriceForMultiYearItems,
  handlePrices,
} from '../../utils/cart.mjs';

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

      const cartItemsWithRecalculatedPrices = cart.items.map(cartItem => {
        const { hasCustomDomainInCart, type, period } = cartItem;
        const { addBundles, address, renewDomain } = handledPrices;

        let nativeFioAmount = null;

        switch (type) {
          case CART_ITEM_TYPE.ADD_BUNDLES:
            nativeFioAmount = Number(addBundles);
            break;
          case CART_ITEM_TYPE.ADDRESS:
            nativeFioAmount = Number(address);
            break;
          case CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN:
            {
              if (hasCustomDomainInCart) {
                nativeFioAmount = Number(address);
              } else {
                nativeFioAmount = handlePriceForMultiYearItems({
                  includeAddress: true,
                  prices: handledPrices,
                  period,
                });
              }
            }
            break;
          case CART_ITEM_TYPE.DOMAIN:
            nativeFioAmount = handlePriceForMultiYearItems({
              includeAddress: false,
              prices: handledPrices,
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
