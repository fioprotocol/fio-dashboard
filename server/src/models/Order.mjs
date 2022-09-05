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
import { BlockchainTransactionEventLog } from './BlockchainTransactionEventLog.mjs';

import logger from '../logger.mjs';

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
      TRANSACTION_PENDING: 5,
      PARTIALLY_SUCCESS: 6,
      SUCCESS: 7,
      FAILED: 8,
      CANCELED: 9,
      PAYMENT_PENDING: 10,
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

  static attrs(type = 'default') {
    const attributes = {
      default: [
        'id',
        'total',
        'roe',
        'status',
        'data',
        'publicKey',
        'customerIp',
        'refProfileId',
        'userId',
        'createdAt',
        'updatedAt',
        'number',
      ],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
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

  static async listAll(limit = 25, offset = 0) {
    const [orders] = await this.sequelize.query(`
        SELECT 
          o.id, 
          o.roe, 
          o.number, 
          o."total", 
          o."publicKey", 
          o."userId", 
          o."status", 
          o."createdAt", 
          o."updatedAt",
          p.price,
          p.currency,
          p.processor as "paymentProcessor",
          u.email as "userEmail",
          rp.label as "refProfileName"
        FROM "orders" o
          INNER JOIN "payments" p ON p."orderId" = o.id AND p."spentType" = ${Payment.SPENT_TYPE.ORDER}
          INNER JOIN users u ON u.id = o."userId"
          LEFT JOIN "referrer-profiles" rp ON rp.id = o."refProfileId"
        WHERE o."deletedAt" IS NULL
        ORDER BY o.id DESC
        OFFSET ${offset}
        LIMIT ${limit}
      `);

    return orders;
  }

  static async orderInfo(id) {
    const orderObj = await this.findById(id, {
      include: [
        {
          model: OrderItem,
          include: [
            OrderItemStatus,
            { model: BlockchainTransaction, include: [BlockchainTransactionEventLog] },
          ],
        },
        { model: Payment, include: PaymentEventLog },
        User,
        ReferrerProfile,
      ],
    });

    const order = this.format(orderObj.get({ plain: true }));
    const blockchainTransactionsIds = [];

    order.items.forEach(orderItem => {
      orderItem.blockchainTransactions.forEach(blockchainTransactionItem => {
        blockchainTransactionsIds.push(blockchainTransactionItem.id);
      });
    });

    order.blockchainTransactionEvents = await BlockchainTransactionEventLog.list({
      blockchainTransactionId: { [Sequelize.Op.in]: blockchainTransactionsIds },
    });

    return order;
  }

  static async listSearchByFioAddressItems(domain, address) {
    const [orders] = await this.sequelize.query(`
        SELECT 
          o.id, 
          o.roe, 
          o.number, 
          o."total", 
          o."publicKey", 
          o."userId", 
          o."status", 
          o."createdAt", 
          o."updatedAt",
          p.currency,
          u.email as "userEmail",
          rp.label as "refProfileName",
          p.processor as "paymentProcessor",
          min(
            case
              when (oi.domain LIKE '${domain}' ${
      address ? `AND oi.address LIKE '${address}'` : ``
    }) then 1
              when (oi.domain LIKE '${domain}%' ${
      address ? `AND oi.address LIKE '${address}'` : ``
    }) then 2
              when (oi.domain LIKE '${domain}%' ${
      address ? `AND oi.address LIKE '%${address}'` : ``
    }) then 3
              else 4
            end
            ) as orderPriority
        FROM "orders" o
          INNER JOIN "payments" p ON p."orderId" = o.id AND p."spentType" = ${
            Payment.SPENT_TYPE.ORDER
          }
          INNER JOIN users u ON u.id = o."userId"
          LEFT JOIN "referrer-profiles" rp ON rp.id = o."refProfileId"
          LEFT JOIN "order-items" oi ON oi."orderId" = o.id
        WHERE o."deletedAt" IS NULL
        AND o.id IN (SELECT "orderId" FROM "order-items" WHERE ${
          address
            ? `domain LIKE '${domain}%' AND address LIKE '%${address}'`
            : `domain LIKE '%${domain}%'`
        } AND "deletedAt" IS NULL) 
        GROUP BY o.id, p."currency", u.email, rp.label, p.processor
        ORDER BY orderPriority
      `);

    return orders;
  }

  static async listSearchByUserEmail(email) {
    const [orders] = await this.sequelize.query(`
        SELECT 
          o.id, 
          o.roe, 
          o.number, 
          o."total", 
          o."publicKey", 
          o."userId", 
          o."status", 
          o."createdAt", 
          o."updatedAt",
          p.currency,
          u.email as "userEmail",
          rp.label as "refProfileName",
          p.processor as "paymentProcessor",
          min(
            case
              when (u.email LIKE '${email}') then 1
              when (u.email LIKE '${email}%') then 2
              when (u.email LIKE '%${email}%') then 3
              else 4
            end
            ) as orderPriority
        FROM "orders" o
          INNER JOIN "payments" p ON p."orderId" = o.id AND p."spentType" = ${Payment.SPENT_TYPE.ORDER}
          INNER JOIN users u ON u.id = o."userId"
          LEFT JOIN "referrer-profiles" rp ON rp.id = o."refProfileId"
          LEFT JOIN "order-items" oi ON oi."orderId" = o.id
        WHERE o."deletedAt" IS NULL
        AND o."userId" IN (SELECT "id" FROM "users" WHERE email LIKE '%${email}%' AND "deletedAt" IS NULL)
        GROUP BY o.id, p."currency", u.email, rp.label, p.processor
        ORDER BY orderPriority
      `);

    return orders;
  }

  static async listSearchByPublicKey(publicKey) {
    const [orders] = await this.sequelize.query(`
        SELECT 
          o.id, 
          o.roe, 
          o.number, 
          o."total", 
          o."publicKey", 
          o."userId", 
          o."status", 
          o."createdAt", 
          o."updatedAt",
          p.currency,
          u.email as "userEmail",
          rp.label as "refProfileName",
          p.processor as "paymentProcessor"
        FROM "orders" o
          INNER JOIN "payments" p ON p."orderId" = o.id AND p."spentType" = ${Payment.SPENT_TYPE.ORDER}
          INNER JOIN users u ON u.id = o."userId"
          LEFT JOIN "referrer-profiles" rp ON rp.id = o."refProfileId"
          LEFT JOIN "order-items" oi ON oi."orderId" = o.id
        WHERE o."deletedAt" IS NULL
        AND o."publicKey" = '${publicKey}'
        GROUP BY o.id, p."currency", u.email, rp.label, p.processor
        ORDER BY o."createdAt" DESC
      `);

    return orders;
  }

  static async updateStatus(orderId, paymentStatus = null, txStatuses = [], t = null) {
    let orderStatus = null;
    switch (paymentStatus) {
      case Payment.STATUS.PENDING: {
        orderStatus = Order.STATUS.PAYMENT_PENDING;
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

    if (txStatuses.length) {
      orderStatus = Order.STATUS.TRANSACTION_PENDING;
      const txStatusesMap = {
        [BlockchainTransaction.STATUS.PENDING]: 0,
        [BlockchainTransaction.STATUS.CANCEL]: 0,
        [BlockchainTransaction.STATUS.FAILED]: 0,
        [BlockchainTransaction.STATUS.SUCCESS]: 0,
      };

      for (const txStatus of txStatuses) {
        if (txStatusesMap[txStatus] !== undefined) txStatusesMap[txStatus]++;
      }

      // All processed, some succeeded (will be reset if all succeeded all failed)
      if (
        txStatusesMap[BlockchainTransaction.STATUS.SUCCESS] +
          txStatusesMap[BlockchainTransaction.STATUS.FAILED] +
          txStatusesMap[BlockchainTransaction.STATUS.CANCEL] ===
        txStatuses.length
      )
        orderStatus = Order.STATUS.PARTIALLY_SUCCESS;

      // All failed
      if (
        txStatusesMap[BlockchainTransaction.STATUS.FAILED] +
          txStatusesMap[BlockchainTransaction.STATUS.CANCEL] ===
        txStatuses.length
      )
        orderStatus = Order.STATUS.FAILED;

      // All canceled
      if (txStatusesMap[BlockchainTransaction.STATUS.CANCEL] === txStatuses.length)
        orderStatus = Order.STATUS.CANCELED;

      // All success
      if (txStatusesMap[BlockchainTransaction.STATUS.SUCCESS] === txStatuses.length)
        orderStatus = Order.STATUS.SUCCESS;
    }

    if (orderStatus !== null) {
      try {
        await Order.update(
          { status: orderStatus },
          { where: { id: orderId }, transaction: t },
        );
      } catch (err) {
        logger.error(err);
      }
    }
  }

  static format({
    id,
    number,
    total,
    roe,
    publicKey,
    createdAt,
    updatedAt,
    status,
    OrderItems: orderItems,
    Payments: payments,
    User: user,
    ReferrerProfile: refProfile,
  }) {
    return {
      id,
      number,
      total,
      roe,
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
      refProfileName: refProfile ? refProfile.label : null,
    };
  }

  static generateNumber(id) {
    return hashids.encode(id);
  }
}
