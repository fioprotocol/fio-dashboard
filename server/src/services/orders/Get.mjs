import Sequelize from 'sequelize';

import Base from '../Base';
import { Order, User } from '../../models';

import X from '../Exception.mjs';

export default class OrdersGet extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
      publicKey: ['string', 'fio_public_key'],
    };
  }
  async execute({ id, publicKey }) {
    const userId = this.context.id;
    const guestId = this.context.guestId;

    const where = {
      publicKey,
    };

    const userWhere = {
      userProfileType: {
        [Sequelize.Op.not]: User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION,
      },
    };
    if (userId) {
      where.userId = userId;
      userWhere.id = userId;
    }

    // do not get orders created by primary|alternate users
    if (!userId) {
      userWhere.userProfileType = User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION;
    }

    const order = await Order.orderInfo(id, {
      useFormatDetailed: true,
      onlyOrderPayment: true,
      userWhere,
      orderWhere: where,
    });
    if (!order)
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });

    delete order.data;
    delete order.user;

    if (!userId && order.guestId !== guestId) {
      delete order.payment;
    }

    return { data: order };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
