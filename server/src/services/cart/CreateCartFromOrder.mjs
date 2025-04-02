import Base from '../Base';
import X from '../Exception';

import { Cart, Order } from '../../models';

import logger from '../../logger.mjs';

import { createCartFromOrder } from '../../utils/cart.mjs';

import { fioApi } from '../../external/fio.mjs';
import { getROE } from '../../external/roe';

export default class CreateCartFromOrder extends Base {
  static get validationRules() {
    return {
      orderId: ['required', 'string'],
    };
  }

  async execute({ orderId }) {
    try {
      const userId = this.context.id;

      const detailedOrder = await Order.orderInfo(orderId, {
        useFormatDetailed: true,
        onlyOrderPayment: true,
        removePaymentData: true,
        orderWhere: {
          userId,
        },
      });

      if (!detailedOrder)
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            id: 'NOT_FOUND',
          },
        });

      const prices = await fioApi.getPrices();
      const roe = await getROE();

      if (!prices) {
        throw new X({
          code: 'CANNOT_GET',
          fields: {
            prices: 'CANNNOT_GET_PRICES',
          },
        });
      }

      if (!roe) {
        throw new X({
          code: 'CANNOT_GET',
          fields: {
            roe: 'CANNNOT_GET_ROE',
          },
        });
      }

      const { errItems, status } = detailedOrder;

      if (
        (status === Order.STATUS.FAILED || status === Order.PARTIALLY_SUCCESS) &&
        errItems.length
      ) {
        const cartItems = createCartFromOrder({ orderItems: errItems, prices, roe });

        if (!cartItems.length) return { data: { items: [], id: null } };

        const cart = await Cart.create({
          items: cartItems,
          userId,
          options: {
            prices,
            roe,
          },
        });

        return { data: Cart.format(cart.get({ plain: true })) };
      }

      return { data: { items: [], id: null } };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_CREATE_ERROR',
        fields: {
          createCart: 'CANNOT_CREATE_CART',
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
