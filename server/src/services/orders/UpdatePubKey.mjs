import Base from '../Base';
import logger from '../../logger.mjs';

import {
  Cart,
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  User,
  Wallet,
} from '../../models';

import X from '../Exception.mjs';

import {
  calculateCartTotalCost,
  cartItemsToOrderItems,
  getDisplayOrderItems,
} from '../../utils/cart.mjs';
import { checkPrices } from '../../utils/prices.mjs';

export default class OrderUpdatePubKey extends Base {
  static get validationRules() {
    return {
      publicKey: 'string',
    };
  }

  async execute({ publicKey }) {
    const userId = this.context.id;

    let payment = null;
    const order = await Order.getActive({
      userId,
    });

    if (!order) {
      logger.error(`Error active order not found: userId - ${this.context.id}`);

      throw new X({
        code: 'NOT_FOUND',
        fields: {},
      });
    }

    if (publicKey === order.publicKey) {
      logger.info(
        JSON.stringify({
          id: order.id,
          number: order.number,
          lastPubKey: order.publicKey,
          publicKey,
        }),
      );

      return {
        data: {
          success: true,
        },
      };
    }

    const wallet = await Wallet.findOneWhere({ userId, publicKey });
    const lastWallet = await Wallet.findOneWhere({
      userId,
      publicKey: order.publicKey,
    });

    if (!wallet || !lastWallet) {
      logger.error(
        `Error wallet not found: userId - ${this.context.id}, publicKey - ${publicKey}, order pub key - ${order.publicKey}`,
      );

      throw new X({
        code: 'NOT_FOUND',
        fields: {},
      });
    }

    const paymentProcessor = order.Payments[0].processor;
    // Recalculate order items and total when paying using fio and changing wallet to or from ledger type
    const needToUpdateOrderItems =
      paymentProcessor === Payment.PROCESSOR.FIO &&
      wallet.from !== lastWallet.from &&
      (wallet.from === Wallet.CREATED_FROM.LEDGER ||
        lastWallet.from === Wallet.CREATED_FROM.LEDGER);
    const orderItems = [];
    let displayOrderItems = [];

    await Order.sequelize.transaction(async t => {
      await Order.update({ publicKey }, { where: { id: order.id }, transaction: t });

      if (needToUpdateOrderItems) {
        const cart = await Cart.getActive(
          {
            userId,
          },
          { transaction: t },
        );

        const user = await User.findOne({
          where: { id: userId },
          transaction: t,
        });

        const {
          userRefProfile,
          domainsList,
          freeDomainToOwner,
          userHasFreeAddress,
        } = await Cart.getDataForCartItemsUpdate({
          noProfileResolvedUser: null,
          publicKey,
          userId: user.id,
          items: cart.items,
        });

        const { prices, roe } = await Cart.getCartOptions(cart);

        checkPrices(prices, roe);

        const items = await cartItemsToOrderItems({
          cartItems: cart.items,
          prices,
          roe,
          walletType: wallet && wallet.from,
          paymentProcessor,
          domainsList,
          freeDomainToOwner,
          userHasFreeAddress,
          refCode: userRefProfile && userRefProfile.code,
        });

        const { costUsdc: totalCostUsdc } = calculateCartTotalCost({
          cartItems: items.map(({ nativeFio }) => ({
            costNativeFio: nativeFio,
          })),
          roe,
        });

        await Order.update(
          { total: totalCostUsdc, roe },
          { where: { id: order.id }, transaction: t },
        );
        for (const orderItem of order.OrderItems) {
          await OrderItemStatus.destroy({
            where: { orderItemId: orderItem.id },
            transaction: t,
            force: true,
          });
        }
        await OrderItem.destroy({
          where: { orderId: order.id },
          transaction: t,
          force: true,
        });

        for (const {
          action,
          address,
          domain,
          params,
          nativeFio,
          price,
          priceCurrency,
          data,
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
              data,
              orderId: order.id,
            },
            { transaction: t },
          );
          orderItems.push(orderItem);
        }
        displayOrderItems = getDisplayOrderItems({
          orderItems: orderItems.map(orderItem =>
            OrderItem.format(orderItem.get({ plain: true })),
          ),
          roe: order.roe,
        });
      }
    });

    if (needToUpdateOrderItems) {
      await Payment.cancelPayment(order);
      payment = await Payment.createForOrder(order, paymentProcessor, orderItems);
    }

    logger.info(
      JSON.stringify({
        id: order.id,
        number: order.number,
        lastPubKey: order.publicKey,
        publicKey,
        payment,
      }),
    );

    return {
      data: {
        success: true,
        displayOrderItems,
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
