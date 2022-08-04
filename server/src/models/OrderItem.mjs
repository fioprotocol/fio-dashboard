import Sequelize from 'sequelize';

import { FIO_ACTIONS } from '../config/constants.js';

import Base from './Base';
import { Order } from './Order';
import { Payment } from './Payment';
import { BlockchainTransaction } from './BlockchainTransaction';
import { BlockchainTransactionEventLog } from './BlockchainTransactionEventLog';
import { OrderItemStatus } from './OrderItemStatus';

const { DataTypes: DT } = Sequelize;

export class OrderItem extends Base {
  static get ACTION() {
    return FIO_ACTIONS;
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
          comment: 'Crypto Handle name, optional',
          defaultValue: null,
        },
        domain: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Crypto handle domain, optional',
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

  static list(where) {
    return this.findAll({
      where,
      order: [['id', 'ASC']],
    });
  }

  // todo: one of the usage is to get amount of crypto handle registrations by fio domains to check if there is no limit reached
  static async amount(action, refProfileId, statuses, paramsWhere) {
    const statusesWhere =
      statuses.length > 1
        ? ` (${statuses.map(status => `ois."txStatus" = ${status}`).join(' OR ')}) `
        : ` ois."txStatus" = ${statuses[0]} `;
    const refProfileWhere =
      refProfileId === null
        ? 'o."refProfileId" IS NULL'
        : `o."refProfileId" = ${refProfileId}`;

    const [orderItemAmount] = await OrderItem.sequelize.query(`
      SELECT count(oi.id) "orderItemAmount" FROM "order-items" oi 
        JOIN "order-items-status" ois ON ois."orderItemId" = oi.id
        JOIN "orders" o ON o.id = oi."orderId"
      WHERE oi.action = ${action} 
        AND ${statusesWhere} 
        AND ${refProfileWhere}
        AND ${paramsWhere}
      `);
    return orderItemAmount;
  }

  // Used to get order items needed to process
  // Common status is READY or RETRY
  static async getActionRequired(status = BlockchainTransaction.STATUS.READY) {
    const [actions] = await OrderItem.sequelize.query(`
        SELECT 
          oi.id, 
          oi.address, 
          oi.domain, 
          oi.action, 
          oi.params, 
          oi.price,
          o.id "orderId", 
          o.roe, 
          o."publicKey", 
          o."userId", 
          ois."blockchainTransactionId",
          ois."paymentId",
          rp.label,
          rp."regRefCode", 
          rp."regRefApiToken", 
          rp.tpid,
          fap.actor,
          fap.permission
        FROM "order-items" oi
          INNER JOIN "order-items-status" ois ON ois."orderItemId" = oi.id
          INNER JOIN orders o ON o.id = oi."orderId"
          LEFT JOIN "referrer-profiles" rp ON rp.id = o."refProfileId"
          LEFT JOIN "fio-account-profiles" fap ON fap.id = rp."fioAccountProfileId"
        WHERE ois."paymentStatus" = ${Payment.STATUS.COMPLETED} 
          AND ois."txStatus" = ${status}
        ORDER BY oi.id
        LIMIT 100
      `);

    return actions;
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
    action,
    address,
    domain,
    createdAt,
    updatedAt,
    OrderItemStatus: orderItemStatus,
    BlockchainTransactions: blockchainTransactions,
  }) {
    return {
      id,
      price,
      priceCurrency,
      action,
      address,
      domain,
      createdAt,
      updatedAt,
      orderItemStatus: orderItemStatus ? OrderItemStatus.format(orderItemStatus) : {},
      blockchainTransactions:
        blockchainTransactions && blockchainTransactions.length
          ? blockchainTransactions.map(item => BlockchainTransaction.format(item))
          : [],
    };
  }
}
