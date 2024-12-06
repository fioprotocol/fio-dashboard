import Sequelize from 'sequelize';

import Base from '../Base';
import {
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  ReferrerProfile,
  User,
} from '../../models';

import X from '../Exception.mjs';

export default class OrdersGet extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
      publicKey: ['required', 'string'],
    };
  }
  async execute({ id, publicKey }) {
    const userId = this.context.id;
    const guestId = this.context.guestId;

    const where = {
      id,
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
    if (!userId && !guestId) {
      userWhere.userProfileType = User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION;
    }

    const order = await Order.findOne({
      where: {
        id,
        publicKey,
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
        { model: User, where: userWhere, required: true },
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

    const data = await Order.formatDetailed(order.get({ plain: true }));

    delete data.data;
    delete data.user;

    if (!userId && order.guestId !== guestId) {
      delete data.payment;
    }

    return { data };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
