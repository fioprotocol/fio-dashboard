import WsBase from '../WsBase';

import { Order, Payment } from '../../models';

export default class WsStatus extends WsBase {
  constructor(args) {
    super(args);

    this.WAIT_PERIOD_MS = 1000;
    this.messageData = {
      orderStatus: 0,
      paymentStatus: 0,
    };
  }

  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            orderId: 'integer',
          },
        },
      ],
    };
  }

  async watch({ data: { orderId } }) {
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: this.context.id,
      },
      include: [Payment],
    });

    if (
      this.messageData.orderStatus !== order.status ||
      this.messageData.paymentStatus !== order.Payments[0].status
    ) {
      this.messageData.orderStatus = order.status;
      this.messageData.paymentStatus = order.Payments[0].status;
      this.wsConnection.send(
        JSON.stringify({
          data: this.messageData,
        }),
      );
    }
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
