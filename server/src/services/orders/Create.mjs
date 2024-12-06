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

import X from '../Exception.mjs';

import { calculateCartTotalCost, cartItemsToOrderItems } from '../../utils/cart.mjs';
import { getExistUsersByPublicKeyOrCreateNew } from '../../utils/user.mjs';
import { checkPrices } from '../../utils/prices.mjs';

export default class OrdersCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            publicKey: ['required', 'string'],
            paymentProcessor: [
              'required',
              'string',
              {
                one_of: [
                  Payment.PROCESSOR.FIO,
                  Payment.PROCESSOR.STRIPE,
                  Payment.PROCESSOR.BITPAY,
                ],
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

  async execute({ data: { publicKey, paymentProcessor, data, refCode } }) {
    let user;
    let refProfile;

    if (this.context.id) {
      user = await User.findActive(this.context.id);
    } else if (publicKey && refCode) {
      // No profile flow
      const [resolvedUser] = await getExistUsersByPublicKeyOrCreateNew(
        publicKey,
        refCode,
      );
      user = resolvedUser;
    }

    const cart = await Cart.getActive({
      userId: user && user.id,
      guestId: this.context.guestId,
    });

    if (!user || !cart) {
      if (!user)
        logger.error(
          `Error user not found: cartId - ${cart &&
            cart.id}, refCode - ${refCode}, publicKey - ${publicKey}`,
        );
      if (!cart)
        logger.error(
          `Error cart not found: refCode - ${refCode}, publicKey - ${publicKey}`,
        );

      throw new X({
        code: 'NOT_FOUND',
        fields: {},
      });
    }

    const { prices, roe } = cart.options;

    checkPrices(prices, roe);

    let order;
    let payment = null;
    const orderItems = [];

    if (user.refProfileId)
      refProfile = await ReferrerProfile.findOneWhere({ id: user.refProfileId });

    await Order.removeIrrelevant({
      userId: user.id,
      guestId: this.context.guestId,
    });

    const cartPublicKey =
      user.userProfileType === User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION
        ? publicKey
        : cart.publicKey;

    const dashboardDomains = await Domain.getDashboardDomains();
    const allRefProfileDomains = refProfile
      ? await ReferrerProfile.getRefDomainsList({
          refCode: refProfile.code,
        })
      : [];

    const userHasFreeAddress =
      (await FreeAddress.getItems({
        publicKey: cartPublicKey,
        userId: user.id,
      })) || [];

    const wallet = await Wallet.findOneWhere({ userId: user.id, publicKey });

    const items = await cartItemsToOrderItems({
      allRefProfileDomains,
      cartItems: cart.items,
      dashboardDomains,
      FioAccountProfile,
      prices,
      roe,
      userHasFreeAddress,
      walletType: wallet && wallet.from,
      refCode: refProfile && refProfile.code,
    });

    const { costUsdc: totalCostUsdc } = calculateCartTotalCost({
      cartItems: items.map(({ nativeFio }) => ({ costNativeFio: nativeFio })),
      roe,
    });

    await Order.sequelize.transaction(async t => {
      order = await Order.create(
        {
          status: Order.STATUS.NEW,
          total: totalCostUsdc,
          roe,
          publicKey,
          customerIp: this.context.ipAddress,
          userId: user.id,
          guestId: this.context.guestId,
          refProfileId: refProfile && refProfile.id,
          data,
        },
        { transaction: t },
      );

      order.number = Order.generateNumber(order.id);

      await order.save({ transaction: t });

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

    payment = await Payment.createForOrder(order, paymentProcessor, orderItems);

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
