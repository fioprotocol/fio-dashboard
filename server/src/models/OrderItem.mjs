import Sequelize from 'sequelize';

import { GenericAction } from '@fioprotocol/fiosdk';

import Base from './Base';
import { Order } from './Order';
import { Payment } from './Payment';
import { ReferrerProfile } from './ReferrerProfile';
import { BlockchainTransaction } from './BlockchainTransaction';
import { BlockchainTransactionEventLog } from './BlockchainTransactionEventLog';
import { OrderItemStatus } from './OrderItemStatus';

import config from '../config/index.mjs';

const {
  fioChain: { defaultTpid },
} = config;

const { DataTypes: DT } = Sequelize;

export class OrderItem extends Base {
  static get ACTION() {
    return GenericAction;
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        action: {
          type: DT.STRING,
          allowNull: false,
          comment:
            'FIO API action. registerFioAddress / renewFioDomain / addBundledTransactions etc',
        },
        address: {
          type: DT.STRING,
          allowNull: true,
          comment: 'FIO Handle name, optional',
          defaultValue: null,
        },
        domain: {
          type: DT.STRING,
          allowNull: true,
          comment: 'FIO handle domain, optional',
          defaultValue: null,
        },
        params: { type: DT.JSON, comment: 'Params needed for the action' },
        nativeFio: { type: DT.STRING, allowNull: true, comment: 'Item price in FIO' },
        price: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Item price in priceCurrency',
        },
        priceCurrency: {
          type: DT.STRING,
          allowNull: true,
          comment: 'USDC, ETH, ...',
          defaultValue: 'USDC',
        },
        data: { type: DT.JSON, comment: 'Any additional data for the item' },
      },
      {
        sequelize,
        tableName: 'order-items',
        paranoid: true,
        indexes: [
          {
            fields: ['id'],
          },
          {
            fields: ['action'],
          },
          {
            fields: ['address', 'domain'],
          },
          {
            fields: ['orderId'],
          },
        ],
      },
    );
  }

  static associate() {
    this.belongsTo(Order, {
      foreignKey: 'orderId',
      targetKey: 'id',
    });
    this.hasMany(BlockchainTransaction, {
      foreignKey: 'orderItemId',
      sourceKey: 'id',
    });
    this.hasOne(OrderItemStatus, {
      foreignKey: 'orderItemId',
      sourceKey: 'id',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: [
        'id',
        'action',
        'address',
        'domain',
        'params',
        'nativeFio',
        'price',
        'priceCurrency',
        'data',
        'orderId',
        'createdAt',
        'updatedAt',
      ],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static list(where) {
    return this.findAll({
      where,
      order: [['id', 'ASC']],
    });
  }

  static async listAll({ ordersIds }) {
    const query = `
      SELECT
          oi.action,
          oi."priceCurrency",
          oi.price,
          oi."nativeFio",
          oi.data,
          oi.id,
          o.number,
          o.roe,
          ois."txStatus",
          ois."paymentStatus",
          bt."feeCollected"
      FROM
          "order-items" AS oi
      JOIN
          orders AS o ON oi."orderId" = o.id
      JOIN
          "order-items-status" AS ois ON oi.id = ois."orderItemId"
      LEFT JOIN
        "blockchain-transactions" AS bt ON ois."blockchainTransactionId" = bt.id
      WHERE
          oi."orderId" IN (${ordersIds})
      ORDER BY
          oi.id DESC
  `;

    return this.sequelize.query(query, {
      type: this.sequelize.QueryTypes.SELECT,
    });
  }

  // todo: one of the usage is to get amount of FIO Handle registrations by fio domains to check if there is no limit reached
  static async amount(action, refProfileId, statuses, paramsWhere) {
    const statusesWhere =
      statuses.length > 1
        ? ` (${statuses
            .map(status => `ois."txStatus" = ${this.sequelize.escape(status)}`)
            .join(' OR ')}) `
        : ` ois."txStatus" = ${this.sequelize.escape(statuses[0])} `;
    const refProfileWhere =
      refProfileId === null
        ? 'o."refProfileId" IS NULL'
        : `o."refProfileId" = :refProfileId`;

    return OrderItem.sequelize.query(
      `
      SELECT count(oi.id) "orderItemAmount" FROM "order-items" oi 
        JOIN "order-items-status" ois ON ois."orderItemId" = oi.id
        JOIN "orders" o ON o.id = oi."orderId"
      WHERE oi.action = :action
        AND ${statusesWhere} 
        AND ${refProfileWhere}
        AND ${paramsWhere}
      `,
      {
        replacements: { refProfileId, action },
        type: this.sequelize.QueryTypes.SELECT,
      },
    );
  }

  // Used to get order items needed to process
  // Common status is READY or RETRY
  static async getActionRequired(
    status = BlockchainTransaction.STATUS.READY,
    limit = 20,
  ) {
    const [actions] = await OrderItem.sequelize.query(`
        SELECT 
          oi.id, 
          oi.address, 
          oi.domain, 
          oi.action, 
          oi.params, 
          oi.data, 
          oi.price,
          oi."nativeFio",
          o.id "orderId", 
          o.roe, 
          o."publicKey", 
          o.total,
          o."userId",
          u."freeId",
          u."userProfileType",
          p.processor,
          ois."blockchainTransactionId",
          ois."paymentId",
          rp.label,
          rp."code", 
          rp.tpid,
          drp.tpid as "affiliateTpid",
          fapfree.actor as "freeActor",
          fapfree.permission as "freePermission",
          fappaid.actor as "paidActor",
          fappaid.permission as "paidPermission",
          bt."baseUrl"
        FROM "order-items" oi
          INNER JOIN "order-items-status" ois ON ois."orderItemId" = oi.id
          INNER JOIN orders o ON o.id = oi."orderId"
          LEFT JOIN "users" u ON u.id = o."userId"
          LEFT JOIN "payments" p ON p."orderId" = oi."orderId" AND p."spentType" = ${Payment.SPENT_TYPE.ORDER}
          LEFT JOIN "referrer-profiles" rp ON rp.id = o."refProfileId" AND rp.type = '${ReferrerProfile.TYPE.REF}'
          LEFT JOIN "referrer-profiles" drp ON drp.id = o."refProfileId"
          LEFT JOIN "fio-account-profiles" fapfree ON fapfree.id = rp."freeFioAccountProfileId"
          LEFT JOIN "fio-account-profiles" fappaid ON fappaid.id = rp."paidFioAccountProfileId"
          LEFT JOIN "blockchain-transactions" bt ON ois."blockchainTransactionId" = bt.id
        WHERE ois."paymentStatus" = ${Payment.STATUS.COMPLETED} 
          AND ois."txStatus" = ${status}
        ORDER BY oi.id
        LIMIT ${limit}
      `);

    return actions.map(action => {
      if (!action.tpid) {
        action.tpid = defaultTpid;
      }
      if (!action.affiliateTpid) {
        action.affiliateTpid = defaultTpid;
      }
      return action;
    });
  }

  static async setPending(tx, orderItemId, blockchainTransactionId) {
    await BlockchainTransactionEventLog.create({
      status: BlockchainTransaction.STATUS.PENDING,
      blockchainTransactionId,
    });

    return OrderItem.sequelize.transaction(async t => {
      await BlockchainTransaction.update(
        {
          // expiration: expiration + 'Z',
          txId: tx.transaction_id,
          blockNum: tx.block_num,
          blockTime: tx.block_time ? tx.block_time + 'Z' : new Date(),
          status: BlockchainTransaction.STATUS.PENDING,
          feeCollected: tx.fee_collected,
          baseUrl: tx.baseUrl,
        },
        {
          where: {
            id: blockchainTransactionId,
            orderItemId,
            status: BlockchainTransaction.STATUS.READY,
          },
          transaction: t,
        },
      );

      await OrderItemStatus.update(
        {
          txStatus: BlockchainTransaction.STATUS.PENDING,
        },
        {
          where: {
            orderItemId,
            blockchainTransactionId,
            txStatus: BlockchainTransaction.STATUS.READY,
          },
          transaction: t,
        },
      );
    });
  }

  static format({
    id,
    price,
    priceCurrency,
    nativeFio,
    action,
    address,
    domain,
    data,
    createdAt,
    updatedAt,
    Order: order,
    OrderItemStatus: orderItemStatus,
    BlockchainTransactions: blockchainTransactions,
  }) {
    return {
      id,
      price,
      priceCurrency,
      nativeFio,
      action,
      address,
      domain,
      data,
      createdAt,
      updatedAt,
      order: order ? Order.format(order) : null,
      orderItemStatus: orderItemStatus ? OrderItemStatus.format(orderItemStatus) : {},
      blockchainTransactions:
        blockchainTransactions && blockchainTransactions.length
          ? blockchainTransactions.map(item => BlockchainTransaction.format(item))
          : [],
    };
  }
}
