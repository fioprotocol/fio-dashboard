import Sequelize from 'sequelize';

import Base from '../Base';

import {
  Cart,
  Domain,
  FioAccountProfile,
  FreeAddress,
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  ReferrerProfile,
  User,
} from '../../models';

import { DAY_MS, PAYMENTS_STATUSES } from '../../config/constants.js';
import X from '../Exception.mjs';

import {
  calculateCartTotalCost,
  cartItemsToOrderItems,
  handlePrices,
} from '../../utils/cart.mjs';

export default class OrdersCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            cartId: ['required', 'string'],
            roe: 'string',
            publicKey: 'string',
            paymentProcessor: 'string',
            refProfileId: 'integer',
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
            data: {
              nested_object: {
                gaClientId: 'string',
                gaSessionId: 'string',
              },
            },
          },
        },
      ],
    };
  }

  async execute({
    data: { cartId, roe, publicKey, paymentProcessor, prices, refProfileId, data },
  }) {
    const userId = this.context.id;
    // assume user should have only one active order with status NEW
    const exOrder = await Order.findOne({
      where: {
        status: Order.STATUS.NEW,
        userId,
        createdAt: {
          [Sequelize.Op.gt]: new Date(new Date().getTime() - DAY_MS),
        },
      },
      include: [OrderItem],
    });
    let order;
    let payment = null;
    const orderItems = [];

    const user = await User.findActive(userId);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await Order.sequelize.transaction(async t => {
      // Update existing new order and remove items from it
      if (exOrder) {
        exOrder.status = Order.STATUS.CANCELED;

        await exOrder.save({ transaction: t });
        await OrderItemStatus.update(
          { paymentStatus: PAYMENTS_STATUSES.CANCELLED },
          {
            where: {
              orderItemId: {
                [Sequelize.Op.in]: exOrder.OrderItems.map(({ id }) => id),
              },
            },
            transaction: t,
          },
        );
      }

      const cart = await Cart.findById(cartId);

      if (!cart) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            cart: 'NOT_FOUND',
          },
        });
      }

      const { costUsdc: totalCostUsdc } = calculateCartTotalCost({
        cartItems: cart.items,
        roe,
      });

      order = await Order.create(
        {
          status: Order.STATUS.NEW,
          total: totalCostUsdc,
          roe,
          publicKey,
          customerIp: this.context.ipAddress,
          userId,
          refProfileId: refProfileId ? refProfileId : user.refProfileId,
          data,
        },
        { transaction: t },
      );

      order.number = Order.generateNumber(order.id);
      await order.save({ transaction: t });

      const { handledPrices, handledRoe } = await handlePrices({ prices, roe });

      const dashboardDomains = await Domain.getDashboardDomains();
      const allRefProfileDomains = await ReferrerProfile.getRefDomainsList();
      const userHasFreeAddress =
        userId &&
        (await FreeAddress.getItem({
          userId,
        }));

      const {
        addBundles: addBundlesPrice,
        address: addressPrice,
        domain: domainPrice,
        renewDomain: renewDomainPrice,
      } = handledPrices;

      const isEmptyPrices =
        !addBundlesPrice || !addressPrice || !domainPrice || !renewDomainPrice;

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

      const items = await cartItemsToOrderItems({
        cartItems: cart.items,
        dashboardDomains: [...dashboardDomains, ...allRefProfileDomains],
        FioAccountProfile,
        prices: handledPrices,
        roe: handledRoe,
        userHasFreeAddress,
      });

      for (const {
        action,
        address,
        domain,
        params,
        nativeFio,
        price,
        priceCurrency,
        data: itemData,
      } of items) {
        const orderItem = await OrderItem.create(
          {
            action,
            address,
            domain,
            params,
            nativeFio,
            price,
            priceCurrency: priceCurrency || Payment.CURRENCY.USDC,
            data: itemData ? { ...itemData } : null,
            orderId: order.id,
          },
          { transaction: t },
        );
        orderItems.push(orderItem);
      }
    });

    if (paymentProcessor)
      payment = await Payment.createForOrder(
        order,
        exOrder,
        paymentProcessor,
        orderItems,
      );

    return {
      data: {
        id: order.id,
        number: order.number,
        publicKey: order.publicKey,
        payment,
      },
    };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
