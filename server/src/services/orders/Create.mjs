import Sequelize from 'sequelize';

import Base from '../Base';

import {
  Cart,
  Domain,
  FioAccountProfile,
  FreeAddress,
  Order,
  OrderItem,
  Payment,
  ReferrerProfile,
  User,
  Wallet,
} from '../../models';

import { DAY_MS } from '../../config/constants.js';
import X from '../Exception.mjs';

import {
  calculateCartTotalCost,
  cartItemsToOrderItems,
  handlePrices,
} from '../../utils/cart.mjs';

import config from '../../config/index.mjs';

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
            refProfileId: 'string',
            userId: 'string',
            prices: [
              {
                nested_object: {
                  addBundles: ['string'],
                  address: ['string'],
                  domain: ['string'],
                  combo: ['string'],
                  renewDomain: ['string'],
                },
              },
            ],
            data: {
              nested_object: {
                gaClientId: 'string',
                gaSessionId: 'string',
                orderUserType: 'string',
              },
            },
          },
        },
      ],
      cookies: ['any_object'],
    };
  }

  async execute({
    data: {
      cartId,
      roe,
      publicKey,
      paymentProcessor,
      prices,
      refProfileId,
      data,
      userId,
    },
    cookies,
  }) {
    let order = await Order.findOne({
      where: {
        status: Order.STATUS.NEW,
        userId,
        createdAt: {
          [Sequelize.Op.gt]: new Date(new Date().getTime() - DAY_MS),
        },
      },
      include: [OrderItem],
    });

    let payment = null;
    const orderItems = [];

    const refCookie = cookies && cookies[config.refCookieName];

    const user = await User.findActive(userId);

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

    const metamaskUserPublicKey = cart.metamaskUserPublicKey;

    const { handledPrices, handledRoe } = await handlePrices({ prices, roe });

    const dashboardDomains = await Domain.getDashboardDomains();
    const allRefProfileDomains = await ReferrerProfile.getRefDomainsList({
      refCode: refCookie,
    });
    const userHasFreeAddress = metamaskUserPublicKey
      ? await FreeAddress.getItems({ publicKey: metamaskUserPublicKey })
      : userId
      ? await FreeAddress.getItems({
          userId,
        })
      : null;

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

    const wallet = await Wallet.findOneWhere({ userId: this.context.id, publicKey });

    const items = await cartItemsToOrderItems({
      allRefProfileDomains,
      cartItems: cart.items,
      dashboardDomains,
      FioAccountProfile,
      prices: handledPrices,
      roe: handledRoe,
      userHasFreeAddress,
      walletType: wallet && wallet.from,
      refCode: refCookie,
    });

    await Order.sequelize.transaction(async t => {
      if (!order) {
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
      } else {
        await Order.update({ publicKey }, { where: { id: order.id }, transaction: t });
        await OrderItem.destroy({
          where: { orderId: order.id },
        });
      }

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
        let orderItemData = itemData;

        if (metamaskUserPublicKey) {
          orderItemData = itemData
            ? { ...itemData, metamaskUserPublicKey }
            : { metamaskUserPublicKey };
        }

        const orderItem = await OrderItem.create(
          {
            action,
            address,
            domain,
            params,
            nativeFio,
            price,
            priceCurrency: priceCurrency || Payment.CURRENCY.USDC,
            data: orderItemData ? { ...orderItemData } : null,
            orderId: order.id,
          },
          { transaction: t },
        );
        orderItems.push(orderItem);
      }
    });

    if (paymentProcessor) {
      payment = await Payment.createForOrder(order, paymentProcessor, orderItems);
    }

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
