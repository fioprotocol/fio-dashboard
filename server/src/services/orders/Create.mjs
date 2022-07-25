import Sequelize from 'sequelize';

import Base from '../Base';

import { Order, OrderItem, OrderItemStatus, Payment } from '../../models';

import { DAY_MS } from '../../config/constants.js';

export default class OrdersCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            total: 'string',
            roe: 'string',
            publicKey: 'string',
            paymentProcessor: 'string',
            items: [
              {
                list_of_objects: {
                  action: 'string',
                  address: 'string',
                  domain: 'string',
                  params: 'any_object',
                  nativeFio: 'string',
                  price: 'string',
                  priceCurrency: 'string',
                },
              },
            ],
          },
        },
      ],
    };
  }

  async execute({ data: { total, roe, publicKey, paymentProcessor, items } }) {
    // assume user should have only one active order with status NEW
    let order = await Order.findOne({
      where: {
        status: Order.STATUS.NEW,
        userId: this.context.id,
        createdAt: {
          [Sequelize.Op.gt]: new Date(new Date().getTime() - DAY_MS),
        },
      },
      include: [OrderItem],
    });
    let payment = null;
    const orderItems = [];

    await Order.sequelize.transaction(async t => {
      // Update existing new order and remove items from it
      if (order) {
        order.total = total;
        order.roe = roe;
        order.publicKey = publicKey;
        order.customerIp = this.context.ipAddress;
        // order.refProfileId: , // todo:

        await order.save({ transaction: t });
        await OrderItemStatus.destroy({
          where: {
            orderItemId: { [Sequelize.Op.in]: order.OrderItems.map(({ id }) => id) },
          },
          force: true,
          transaction: t,
        });
        await OrderItem.destroy({
          where: { orderId: order.id },
          force: true,
          transaction: t,
        });
      } else {
        order = await Order.create(
          {
            status: Order.STATUS.NEW,
            total,
            roe,
            publicKey,
            customerIp: this.context.ipAddress,
            userId: this.context.id,
          },
          { transaction: t },
        );

        order.number = Order.generateNumber(order.id);
        await order.save({ transaction: t });
      }

      for (const {
        action,
        address,
        domain,
        params,
        nativeFio,
        price,
        priceCurrency,
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
            orderId: order.id,
          },
          { transaction: t },
        );
        orderItems.push(orderItem);
      }
    });

    if (paymentProcessor)
      payment = await Payment.createForOrder(order, paymentProcessor, orderItems);

    return {
      data: {
        id: order.id,
        number: order.number,
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
