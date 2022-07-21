import Sequelize from 'sequelize';
import Hashids from 'hashids';

import Base from './Base';
import { User } from './User';
import { ReferrerProfile } from './ReferrerProfile';
import { OrderItem } from './OrderItem';
import { OrderItemStatus } from './OrderItemStatus.mjs';
import { Payment } from './Payment';
import { PaymentEventLog } from './PaymentEventLog.mjs';
import { BlockchainTransaction } from './BlockchainTransaction.mjs';

const { DataTypes: DT } = Sequelize;
const ORDER_NUMBER_LENGTH = 6;
const ORDER_NUMBER_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const hashids = new Hashids(
  process.env.ORDER_NUMBER_SALT,
  ORDER_NUMBER_LENGTH,
  ORDER_NUMBER_ALPHABET,
);

export class Order extends Base {
  static get STATUS() {
    return {
      NEW: 1,
      PENDING: 2,
      PAYMENT_AWAITING: 3,
      PAID: 4,
      TRANSACTION_EXECUTED: 5,
      PARTIALLY_SUCCESS: 6,
      DONE: 7,
      FAILED: 8,
      CANCELED: 9,
    };
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        number: {
          type: DT.STRING,
          allowNull: true,
          unique: true,
          defaultValue: null,
          comment: 'Order number',
        },
        total: { type: DT.STRING, allowNull: true, comment: 'Total cost' },
        roe: {
          type: DT.STRING,
          allowNull: false,
          comment: 'ROE value at the moment of order creation',
        },
        status: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
          comment:
            'Order status: NEW (1) , PENDING (2), PAYMENT_AWAITING (3), PAID (4), TRANSACTION_EXECUTED (5), PARTIALLY_SUCCESS (6), DONE (7)',
        },
        data: { type: DT.JSON, comment: 'Any additional data for the order' },
        publicKey: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Owner Wallet public key',
          defaultValue: null,
        },
        customerIp: {
          type: DT.STRING,
          allowNull: true,
          comment: 'IP Address of customer to limit free actions',
          defaultValue: null,
        },
      },
      {
        sequelize,
        tableName: 'orders',
        paranoid: true,
        indexes: [
          {
            fields: ['id'],
          },
          {
            fields: ['userId'],
          },
          {
            fields: ['refProfileId', 'publicKey', 'userId'],
          },
          {
            fields: ['status'],
          },
        ],
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
    this.belongsTo(ReferrerProfile, {
      foreignKey: 'refProfileId',
      targetKey: 'id',
    });
    this.hasMany(OrderItem, {
      foreignKey: 'orderId',
      sourceKey: 'id',
    });
    this.hasMany(Payment, {
      foreignKey: 'orderId',
      sourceKey: 'id',
    });
  }

  static list(userId, search, page, limit = 50) {
    const where = { userId };

    if (search) {
      where.number = { [Sequelize.Op.iLike]: search };
    }

    return this.findAll({
      where,
      include: [OrderItem, Payment],
      order: [['id', 'DESC']],
      offset: (page - 1) * limit,
      limit,
    });
  }

  static ordersCount() {
    return this.count();
  }

  static listAll(limit = 25, offset = 0) {
    return this.findAll({
      include: [Payment, User],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  static orderInfo(id) {
    return this.findById(id, {
      include: [
        { model: OrderItem, include: OrderItemStatus },
        { model: Payment, include: PaymentEventLog },
        User,
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  static async updateStatus(orderId, paymentStatus = null, txStatus = null, t = null) {
    let orderStatus = null;
    switch (paymentStatus) {
      case Payment.STATUS.PENDING: {
        orderStatus = Order.STATUS.PENDING;
        break;
      }
      case Payment.STATUS.EXPIRED: {
        orderStatus = Order.STATUS.FAILED;
        break;
      }
      case Payment.STATUS.CANCELLED: {
        orderStatus = Order.STATUS.CANCELED;
        break;
      }
      case Payment.STATUS.COMPLETED: {
        orderStatus = Order.STATUS.PAID;
        break;
      }
      default:
      //
    }
    switch (txStatus) {
      case BlockchainTransaction.STATUS.PENDING: {
        orderStatus = Order.STATUS.PAID;
        break;
      }
      case BlockchainTransaction.STATUS.CANCEL: {
        orderStatus = Order.STATUS.CANCELED;
        break;
      }
      case BlockchainTransaction.STATUS.RETRY_PROCESSED: {
        orderStatus = Order.STATUS.FAILED;
        break;
      }
      case BlockchainTransaction.STATUS.SUCCESS: {
        orderStatus = Order.STATUS.TRANSACTION_EXECUTED;
        break;
      }
      default:
      //
    }

    if (orderStatus !== null)
      await Order.update(
        { status: orderStatus },
        { where: { id: orderId }, transaction: t },
      );
  }

  static format({
    id,
    number,
    total,
    publicKey,
    createdAt,
    updatedAt,
    status,
    OrderItems: orderItems,
    Payments: payments,
    User: user,
  }) {
    return {
      id,
      number,
      total,
      publicKey,
      createdAt,
      updatedAt,
      status,
      user: user ? { id: user.id, email: user.email } : null,
      items:
        orderItems && orderItems.length
          ? orderItems.map(item => OrderItem.format(item))
          : [],
      payments:
        payments && payments.length ? payments.map(item => Payment.format(item)) : [],
    };
  }

  static generateNumber(id) {
    return hashids.encode(id);
  }
}
