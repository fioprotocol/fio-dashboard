import Base from '../Base';

import { Order, OrderItem } from '../../models';

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

  async execute({ data: { total, roe, publicKey, items } }) {
    let newOrder = {};
    await Order.sequelize.transaction(async t => {
      newOrder = await Order.create(
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

      newOrder.number = Order.generateNumber(newOrder.id);
      await newOrder.save({ transaction: t });

      for (const {
        action,
        address,
        domain,
        params,
        nativeFio,
        price,
        priceCurrency,
      } of items) {
        await OrderItem.create(
          {
            action,
            address,
            domain,
            params,
            nativeFio,
            price,
            priceCurrency: priceCurrency || 'USDC',
            orderId: newOrder.id,
          },
          { transaction: t },
        );
      }
    });

    return {
      data: newOrder,
    };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
