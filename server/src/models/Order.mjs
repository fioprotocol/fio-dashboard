import Sequelize from 'sequelize';
import Hashids from 'hashids';

import { GenericAction } from '@fioprotocol/fiosdk';

import Base from './Base';
import { User } from './User';
import { ReferrerProfile } from './ReferrerProfile';
import { OrderItem } from './OrderItem';
import { OrderItemStatus } from './OrderItemStatus.mjs';
import { Payment } from './Payment';
import { PaymentEventLog } from './PaymentEventLog.mjs';
import { BlockchainTransaction } from './BlockchainTransaction.mjs';
import { BlockchainTransactionEventLog } from './BlockchainTransactionEventLog.mjs';
import { Var } from './Var.mjs';

import {
  countTotalPriceAmount,
  getPaidWith,
  generateErrBadgeItem,
  transformOrderTotalCostToPriceObj,
  transformOrderItemCostToPriceString,
  combineOrderItems,
} from '../utils/order.mjs';

import {
  FIO_ADDRESS_DELIMITER,
  FIO_ACTIONS_LABEL,
  CART_ITEM_TYPE,
  ORDER_ERROR_TYPES,
  PAYMENTS_STATUSES,
} from '../config/constants.js';
import { ORDER_USER_TYPES } from '../constants/order.mjs';

import logger from '../logger.mjs';

const { DataTypes: DT } = Sequelize;
const ORDER_NUMBER_LENGTH = 6;
const ORDER_NUMBER_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const hashids = new Hashids(
  process.env.ORDER_NUMBER_SALT,
  ORDER_NUMBER_LENGTH,
  ORDER_NUMBER_ALPHABET,
);

const DEFAULT_ORDERS_LIMIT = 25;
const DEFAULT_ORDER_TIMEOUT = 1000 * 60 * 30; // 30 min
const ORDER_TIMEOUT_KEY = 'ORDER_TIMEOUT'; // 30 min

export class Order extends Base {
  static get STATUS() {
    return {
      NEW: 1, // When user chooses payment method
      PENDING: 2,
      PAYMENT_AWAITING: 3,
      PAID: 4, // Payment completed, 'success' payment webhook received
      TRANSACTION_PENDING: 5, // Started executing order items
      PARTIALLY_SUCCESS: 6,
      SUCCESS: 7,
      FAILED: 8,
      CANCELED: 9,
      PAYMENT_PENDING: 10, // 'waiting' webhook received / Updated from client side when purchased
    };
  }

  static get FREE_STATUS() {
    return {
      IS_FREE: 1,
      IS_PAID: 2,
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
        total: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Total cost',
        },
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
        data: {
          type: DT.JSON,
          comment: 'Any additional data for the order',
        },
        guestId: {
          type: DT.UUID,
          allowNull: true,
        },
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

  static async ORDER_TIMEOUT() {
    return (await Var.getValByKey(ORDER_TIMEOUT_KEY)) || DEFAULT_ORDER_TIMEOUT;
  }

  static async list({
    guestId,
    userId,
    search,
    offset,
    limit = DEFAULT_ORDERS_LIMIT,
    isProcessed = false,
    publicKey,
  }) {
    const where = {};
    const userWhere = {
      userProfileType: {
        [Sequelize.Op.not]: User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION,
      },
    };

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.number = { [Sequelize.Op.iLike]: search };
    }
    if (isProcessed) {
      where.status = {
        [Sequelize.Op.notIn]: [Order.STATUS.NEW, Order.STATUS.CANCELED],
      };
    }
    if (publicKey) {
      where.publicKey = publicKey;
    }

    // do not get orders created by primary|alternate users
    if (!userId && !guestId) {
      userWhere.userProfileType = User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION;
    }

    return this.findAll({
      where,
      include: [
        OrderItem,
        Payment,
        ReferrerProfile,
        { model: User, required: true, where: userWhere },
      ],
      order: [['createdAt', 'DESC']],
      offset: offset,
      limit,
    });
  }

  static async getActive({ userId, guestId }) {
    const where = {
      status: Order.STATUS.NEW,
      updatedAt: {
        [Sequelize.Op.gt]: Sequelize.literal(
          `now() - interval '${await this.ORDER_TIMEOUT()} ms'`,
        ),
      },
    };

    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    return this.findOne({
      where,
      include: [
        { model: OrderItem, include: [OrderItemStatus] },
        {
          model: Payment,
          where: { spentType: Payment.SPENT_TYPE.ORDER },
        },
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: Payment }, 'createdAt', 'DESC'],
      ],
    });
  }

  static async getPaidById({ id, userId, guestId }) {
    const where = {
      id,
      status: Order.STATUS.PAID,
    };

    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    return this.findOne({
      where,
    });
  }

  static ordersCount(query) {
    return this.count(query);
  }

  static async listAll({ limit = DEFAULT_ORDERS_LIMIT, offset = 0, filters }) {
    const { dateRange = {}, freeStatus, status, orderUserType } = filters;

    const createdAtGte = dateRange.startDate
      ? new Date(dateRange.startDate).toISOString()
      : undefined;
    const createdAtLt = dateRange.endDate
      ? new Date(dateRange.endDate).toISOString()
      : undefined;

    const query = `
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
          COALESCE(o.data->>'orderUserType', null) as "orderUserType",
          u.email as "userEmail",
          rp.label as "refProfileName",
          count(*) OVER() AS "maxCount"
        FROM "orders" o
          LEFT JOIN users u ON u.id = o."userId"
          LEFT JOIN "referrer-profiles" rp ON rp.id = o."refProfileId"
        WHERE o."deletedAt" IS NULL
          ${status ? `AND o."status" = ${status}` : ``}
          ${
            freeStatus
              ? freeStatus === this.FREE_STATUS.IS_FREE
                ? `AND (o."total" = '0' OR o."total" IS NULL)`
                : `AND o."total"::numeric > 0`
              : ``
          }
          ${createdAtGte ? `AND o."createdAt" >= '${createdAtGte}'` : ``}
          ${createdAtLt ? `AND o."createdAt" < '${createdAtLt}'` : ``}
          ${
            orderUserType === ORDER_USER_TYPES.DASHBOARD
              ? `AND (o.data->>'orderUserType' IS NULL OR o.data->>'orderUserType' = '')`
              : orderUserType
              ? `AND o.data->>'orderUserType' = '${orderUserType}'`
              : ``
          }
        ORDER BY o."createdAt" DESC
        OFFSET ${offset}
        ${limit ? `LIMIT ${limit}` : ``}
      `;

    const orders = await this.sequelize.query(query, {
      type: this.sequelize.QueryTypes.SELECT,
    });

    const paymentsQuery = `
      SELECT
          p."orderId",
          p.price,
          p.currency,
          p.processor as "paymentProcessor"
          FROM payments p
          WHERE p."spentType" = ${Payment.SPENT_TYPE.ORDER}
            AND p."orderId" IN (${orders.map(order => order.id).join(',')})
            AND p.id = (SELECT pm.id FROM "payments" pm WHERE pm."orderId" = p."orderId" AND pm."spentType" = 1 ORDER BY pm."createdAt" DESC LIMIT 1)
      `;
    const payments = await this.sequelize.query(paymentsQuery, {
      type: this.sequelize.QueryTypes.SELECT,
    });

    const paymentsMap = payments.reduce((acc, item) => {
      const { orderId, ...rest } = item;
      acc[orderId] = { ...rest };
      return acc;
    }, {});

    return orders.map(order => ({ ...order, ...paymentsMap[order.id] }));
  }

  static async orderInfo(id, useFormatDetailed) {
    const orderObj = await this.findByPk(id, {
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
        { model: Payment, include: PaymentEventLog },
        User,
        ReferrerProfile,
      ],
      order: [[OrderItem, 'id', 'ASC']],
    });

    if (useFormatDetailed) {
      return this.formatDetailed(orderObj.get({ pain: true }));
    } else {
      const order = this.format(orderObj.get({ plain: true }));

      const blockchainTransactionsIds = [];

      order.items.forEach(orderItem => {
        orderItem.blockchainTransactions.forEach(blockchainTransactionItem => {
          blockchainTransactionsIds.push(blockchainTransactionItem.id);
        });
      });

      order.blockchainTransactionEvents = await BlockchainTransactionEventLog.list({
        blockchainTransactionId: {
          [Sequelize.Op.in]: blockchainTransactionsIds,
        },
      });

      return order;
    }
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

  static async listSearchByUserId(userId) {
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
          AND o."userId" = '${userId}'
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

  static async listSearchByNumber(number) {
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
        AND o.number = '${number}'
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
        orderStatus = Order.STATUS.CANCELED;
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
        [BlockchainTransaction.STATUS.EXPIRE]: 0,
      };

      for (const txStatus of txStatuses) {
        if (txStatusesMap[txStatus] !== undefined) txStatusesMap[txStatus]++;
      }

      // All processed, some succeeded (will be reset if all succeeded all failed)
      if (
        txStatusesMap[BlockchainTransaction.STATUS.SUCCESS] +
          txStatusesMap[BlockchainTransaction.STATUS.FAILED] +
          txStatusesMap[BlockchainTransaction.STATUS.CANCEL] +
          txStatusesMap[BlockchainTransaction.STATUS.EXPIRE] ===
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
      if (
        txStatusesMap[BlockchainTransaction.STATUS.CANCEL] +
          txStatusesMap[BlockchainTransaction.STATUS.EXPIRE] ===
        txStatuses.length
      )
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

  /**
   *
   * @param {Sequelize.Model} order Order model
   *
   * @returns {Promise<void>}
   */
  static async cancel(order) {
    try {
      await order.update({ status: Order.STATUS.CANCELED });
      if (order.OrderItems && order.OrderItems.length)
        await OrderItemStatus.update(
          { paymentStatus: PAYMENTS_STATUSES.CANCELLED },
          {
            where: {
              orderItemId: {
                [Sequelize.Op.in]: order.OrderItems.map(({ id }) => id),
              },
            },
          },
        );
      await Payment.cancelPayment(order);
    } catch (err) {
      logger.error(err);
    }
  }

  static async removeIrrelevant({ userId, guestId }) {
    const where = {
      status: Order.STATUS.NEW,
    };

    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    try {
      const orders = await this.findAll({ where });
      for (const order of orders) {
        await this.cancel(order);
      }
    } catch (err) {
      logger.error(err);
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
    data,
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
      orderUserType: data && data.orderUserType,
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

  static getOrderItemType(orderItem) {
    const { action, address, data } = orderItem;
    const { hasCustomDomain } = data || {};

    if (action === GenericAction.renewFioDomain) {
      return CART_ITEM_TYPE.DOMAIN_RENEWAL;
    } else if (action === GenericAction.addBundledTransactions) {
      return CART_ITEM_TYPE.ADD_BUNDLES;
    } else if (!address) {
      return CART_ITEM_TYPE.DOMAIN;
    } else if (
      action === GenericAction.registerFioDomainAddress ||
      (address && hasCustomDomain)
    ) {
      return CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;
    } else {
      return CART_ITEM_TYPE.ADDRESS;
    }
  }

  static async formatDetailed({
    id,
    number,
    total,
    data,
    roe,
    publicKey,
    createdAt,
    status,
    OrderItems: orderItems,
    Payments: payments,
    User: user,
    ReferrerProfile: refProfile,
  }) {
    const errItems = [];
    const regItems = [];

    const items =
      orderItems && orderItems.length
        ? orderItems.map(orderItem => OrderItem.format(orderItem))
        : [];

    const payment =
      (payments &&
        payments.length &&
        payments.find(payment => payment.spentType === Payment.SPENT_TYPE.ORDER)) ||
      {};
    let paidWith = 'N/A';
    if (payment) {
      paidWith = await getPaidWith({
        paymentProcessor: payment.processor,
        publicKey,
        userId: user ? user.id : null,
        payment,
        isCanceledStatus: status === this.STATUS.CANCELED,
      });
    }

    const paymentCurrency =
      payment && payment.currency ? payment.currency : Payment.CURRENCY.FIO;

    for (const orderItem of items) {
      const {
        action,
        address,
        blockchainTransactions,
        data,
        domain,
        price,
        nativeFio,
      } = orderItem;

      const itemStatus = orderItem.orderItemStatus;
      const isFree = price === '0';

      let bcTx = {};
      let customDomainBcTx = {};

      const { hasCustomDomain, cartItemId } = data || {};
      if (itemStatus.blockchainTransactionId) {
        bcTx =
          blockchainTransactions.find(
            bcTxItem => bcTxItem.id === itemStatus.blockchainTransactionId,
          ) || {};
        if (hasCustomDomain) {
          customDomainBcTx = blockchainTransactions.find(
            bcTxItem => bcTxItem.action === GenericAction.registerFioDomain,
          );
          if (customDomainBcTx && customDomainBcTx.feeCollected) {
            bcTx.feeCollected = +bcTx.feeCollected + +customDomainBcTx.feeCollected;
          }
        }
      }

      const fioName = address ? `${address}${FIO_ADDRESS_DELIMITER}${domain}` : domain;
      const feeCollected = bcTx.feeCollected || nativeFio;
      const itemType = this.getOrderItemType(orderItem);

      if (
        itemStatus.txStatus === BlockchainTransaction.STATUS.FAILED ||
        itemStatus.txStatus === BlockchainTransaction.STATUS.CANCEL
      ) {
        const eventLogs = await BlockchainTransactionEventLog.findAll({
          where: {
            blockchainTransactionId: bcTx.id,
          },
        });
        const event = eventLogs.find(
          ({ status }) =>
            status === BlockchainTransaction.STATUS.FAILED ||
            status === BlockchainTransaction.STATUS.CANCEL,
        );
        errItems.push({
          action: hasCustomDomain
            ? FIO_ACTIONS_LABEL[
                `${GenericAction.registerFioAddress}_${GenericAction.registerFioDomain}`
              ]
            : FIO_ACTIONS_LABEL[action],
          originalAction: action,
          address,
          domain,
          fee_collected: isFree ? null : feeCollected,
          costUsdc: price,
          type: itemType,
          error: event ? event.statusNotes : '',
          errorData: event && event.data,
          id: cartItemId || fioName,
          isFree,
          hasCustomDomain,
          priceString: transformOrderItemCostToPriceString({
            fioNativeAmount: feeCollected,
            usdcAmount: price,
            isFree,
          }),
          errorType:
            event && event.data && event.data.errorType
              ? event.data.errorType
              : isFree
              ? ORDER_ERROR_TYPES.freeAddressError
              : ORDER_ERROR_TYPES.default,
        });

        continue;
      }

      regItems.push({
        action: hasCustomDomain
          ? FIO_ACTIONS_LABEL[
              `${GenericAction.registerFioAddress}_${GenericAction.registerFioDomain}`
            ]
          : FIO_ACTIONS_LABEL[action],
        address,
        domain,
        fee_collected: isFree ? null : feeCollected,
        costUsdc: price,
        type: itemType,
        id: cartItemId || fioName,
        isFree,
        hasCustomDomain,
        priceString: transformOrderItemCostToPriceString({
          fioNativeAmount: feeCollected,
          usdcAmount: price,
          isFree,
        }),
        transaction_id: bcTx.txId,
        transaction_ids: [bcTx.txId, customDomainBcTx && customDomainBcTx.txId].filter(
          Boolean,
        ),
      });
    }

    const errorBadges =
      errItems.length > 0 ? generateErrBadgeItem({ errItems, paymentCurrency }) : {};

    const regTotalCostAmount = countTotalPriceAmount(regItems);
    const errTotalCostAmount =
      errItems.length > 0 ? countTotalPriceAmount(errItems) : null;

    const regTotalCostPrice = transformOrderTotalCostToPriceObj({
      totalCostObj: regTotalCostAmount,
    });
    const errTotalCostPrice = transformOrderTotalCostToPriceObj({
      totalCostObj: errTotalCostAmount,
    });

    const regTotalCost = { ...regTotalCostAmount, ...regTotalCostPrice };
    const errTotalCost = { ...errTotalCostAmount, ...errTotalCostPrice };

    const isPartial =
      errItems.length > 0 &&
      regItems.length > 0 &&
      status === this.STATUS.PARTIALLY_SUCCESS;

    const isAllErrored =
      errItems.length > 0 && regItems.length === 0 && status === this.STATUS.FAILED;

    return {
      id,
      number,
      total,
      roe,
      data,
      publicKey,
      createdAt,
      status,
      user: user ? { id: user.id, email: user.email } : null,
      errItems: combineOrderItems({ orderItems: errItems }),
      regItems: combineOrderItems({ orderItems: regItems }),
      errorBadges,
      isAllErrored,
      isPartial,
      payment: {
        regTotalCost,
        errTotalCost,
        paidWith,
        paymentProcessor: payment ? payment.processor : null,
        paymentStatus: payment ? payment.status : null,
        paymentCurrency,
      },
      refProfileName: refProfile ? refProfile.label : null,
    };
  }

  static async formatToMinData({
    id,
    number,
    total,
    roe,
    publicKey,
    createdAt,
    status,
    data,
    Payments: payments,
    User: user,
    ReferrerProfile: refProfile,
  }) {
    const payment =
      (payments &&
        payments.length &&
        payments.find(payment => payment.spentType === Payment.SPENT_TYPE.ORDER)) ||
      {};

    let paidWith = 'N/A';
    if (payment) {
      paidWith = await getPaidWith({
        paymentProcessor: payment.processor,
        publicKey,
        userId: user && user.id ? user.id : null,
        payment,
      });
    }

    return {
      id,
      number,
      total,
      roe,
      publicKey,
      createdAt,
      status,
      orderUserType: data && data.orderUserType,
      payment: {
        paidWith,
        paymentProcessor: payment ? payment.processor : null,
      },
      refProfileName: refProfile ? refProfile.label : null,
    };
  }

  static generateNumber(id) {
    return hashids.encode(id);
  }
}
