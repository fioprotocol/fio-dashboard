import Base from '../Base';
import X from '../Exception';

import {
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  Cart,
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  ReferrerProfile,
  User,
} from '../../models';

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

      const order = await Order.findOne({
        where: {
          id: orderId,
          userId,
        },
        include: [
          {
            model: OrderItem,
            include: [
              OrderItemStatus,
              {
                model: BlockchainTransaction,
                include: [BlockchainTransactionEventLog],
              },
            ],
          },
          {
            model: Payment,
            where: { spentType: Payment.SPENT_TYPE.ORDER },
          },
          User,
          ReferrerProfile,
        ],
        order: [[OrderItem, 'id', 'ASC']],
      });

      if (!order)
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            id: 'NOT_FOUND',
          },
        });

      const detailedOrder = await Order.formatDetailed(order.get({ plain: true }));

      const prices = await fioApi.getPrices(true);
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
