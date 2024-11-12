import Sequelize from 'sequelize';

import Base from '../Base';
import logger from '../../logger.mjs';

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
import { getExistUsersByPublicKeyOrCreateNew } from '../../utils/user.mjs';

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
            refCode: ['string'],
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
      refCode,
    },
  }) {
    let user;

    if (this.context.id) {
      user = await User.findActive(this.context.id);
    } else if (publicKey && refCode) {
      const [resolvedUser] = await getExistUsersByPublicKeyOrCreateNew(
        publicKey,
        refCode,
      );
      user = resolvedUser;
    }

    const cart = await Cart.findByPk(cartId);

    if (!user || !cart) {
      if (!user)
        logger.error(
          `Error user not found: cartId - ${cartId}, refCode - ${refCode}, publicKey - ${publicKey}`,
        );
      if (!cart)
        logger.error(
          `Error cart not found: cartId - ${cartId}, refCode - ${refCode}, publicKey - ${publicKey}`,
        );

      throw new X({
        code: 'NOT_FOUND',
        fields: {},
      });
    }

    const orderWhere = {
      status: Order.STATUS.NEW,
      userId: user.id,
      createdAt: {
        [Sequelize.Op.gt]: new Date(new Date().getTime() - DAY_MS),
      },
    };

    if (cart.guestId && this.context.guestId && cart.guestId !== this.context.guestId) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {},
      });
    }

    const guestId = cart.guestId || this.context.guestId;

    if (guestId) {
      orderWhere.guestId = guestId;
    }

    let order = await Order.findOne({
      where: orderWhere,
      include: [OrderItem],
    });

    let payment = null;
    const orderItems = [];

    const { costUsdc: totalCostUsdc } = calculateCartTotalCost({
      cartItems: cart.items,
      roe,
    });

    const cartPublicKey = cart.publicKey;

    const { handledPrices, handledRoe } = await handlePrices({ prices, roe });

    const dashboardDomains = await Domain.getDashboardDomains();
    const allRefProfileDomains = refCode
      ? await ReferrerProfile.getRefDomainsList({
          refCode,
        })
      : [];
    const userHasFreeAddress = !publicKey
      ? []
      : await FreeAddress.getItems({
          publicKey: cartPublicKey,
          userId: user.id,
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

    const wallet = await Wallet.findOneWhere({ userId: user.id, publicKey });

    const items = await cartItemsToOrderItems({
      allRefProfileDomains,
      cartItems: cart.items,
      dashboardDomains,
      FioAccountProfile,
      prices: handledPrices,
      roe: handledRoe,
      userHasFreeAddress,
      walletType: wallet && wallet.from,
      refCode,
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
            userId: user.id,
            guestId: guestId,
            refProfileId: refProfileId ? refProfileId : user.refProfileId,
            data,
          },
          { transaction: t },
        );

        order.number = Order.generateNumber(order.id);

        await order.save({ transaction: t });
      } else {
        await Order.update(
          { publicKey, total: totalCostUsdc },
          { where: { id: order.id }, transaction: t },
        );
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

        if (cartPublicKey) {
          orderItemData = itemData
            ? { ...itemData, publicKey: cartPublicKey }
            : { publicKey: cartPublicKey };
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
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
