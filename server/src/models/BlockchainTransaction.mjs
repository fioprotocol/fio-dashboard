import Sequelize from 'sequelize';

import { GenericAction } from '@fioprotocol/fiosdk';

import Base from './Base';
import { OrderItem } from './OrderItem.mjs';
import { BlockchainTransactionEventLog } from './BlockchainTransactionEventLog';
import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class BlockchainTransaction extends Base {
  static get ACTION() {
    return GenericAction;
  }
  static get STATUS_LABELS() {
    return {
      READY: 'READY',
      PENDING: 'PENDING',
      CANCEL: 'CANCEL', // not used now
      FAILED: 'FAILED',
      SUCCESS: 'SUCCESS',
      RETRY: 'RETRY', // not used now
      RETRY_PROCESSED: 'RETRY_PROCESSED', // not used now
      EXPIRE: 'EXPIRE', // not used now
    };
  }

  // For each orderItemId should be maximum one record with status READY/PENDING/SUCCESS/RETRY,
  // could be several records with status RETRY_PROCESSED for one orderItemId
  static get STATUS() {
    return {
      NONE: 0,
      READY: 1,
      PENDING: 2,
      SUCCESS: 3,
      FAILED: 4,
      CANCEL: 5, // not used now
      RETRY: 6, // not used now
      EXPIRE: 7,
      RETRY_PROCESSED: 8, // not used now
    };
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        action: {
          type: DT.STRING,
          comment:
            'Action name. registerFioAddress / renewFioDomain / addBundledTransactions etc.',
        },
        expiration: {
          type: DT.DATE,
          allowNull: true,
          comment: 'Blockchain transaction expiration',
        },
        txId: {
          type: DT.STRING,
          comment: 'Transaction ID',
        },
        blockNum: {
          type: DT.INTEGER,
          comment: 'Block for this transaction',
        },
        blockTime: {
          type: DT.DATE,
          comment: 'Block time for this transaction, used to determine irreversibility',
        },
        status: {
          type: DT.INTEGER,
          defaultValue: 1,
          comment:
            'Last action processing status. READY (1) / PENDING (2) / RETRY (6) / SUCCESS (3) / FAILED (4) / CANCEL (5) etc.',
        },
        data: { type: DT.JSON, comment: 'Any additional data' },
        feeCollected: { type: DT.BIGINT },
      },
      {
        sequelize,
        tableName: 'blockchain-transactions',
        paranoid: true,
        indexes: [
          {
            fields: ['id'],
          },
          {
            fields: ['txId'],
            unique: true,
          },
          {
            fields: ['action'],
          },
          {
            fields: ['status'],
          },
          {
            fields: ['orderItemId'],
          },
        ],
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'createdBy',
      targetKey: 'id',
    });
    this.belongsTo(OrderItem, {
      foreignKey: 'orderItemId',
      targetKey: 'id',
    });
    this.hasMany(BlockchainTransactionEventLog, {
      foreignKey: 'blockchainTransactionId',
      sourceKey: 'id',
    });
  }

  static list(where) {
    return this.findAll({
      where,
      order: [['id', 'ASC']],
    });
  }

  static checkIrreversibility() {
    return this.sequelize.query(`
      SELECT oi.id,
             oi.address,
             oi.domain,
             oi.action,
             oi.params,
             oi.data,
             oi."orderId",
             o."publicKey",
             o."userId",
             bt.expiration,
             bt."blockTime",
             bt.data as "btData",
             bt.id AS "btId",
             bt."txId"
      FROM "order-items" oi
        INNER JOIN "blockchain-transactions" bt ON oi.id = bt."orderItemId"
        JOIN "orders" o ON oi."orderId" = o.id
      WHERE bt.status = ${this.STATUS.PENDING}
      LIMIT 100
   `);
  }

  static expireRetry() {
    const RETRIES_LIMIT = 3;
    return this.sequelize.query(`
    WITH r as (
             -- get retry counts
             SELECT count(*) AS retries, rbt.id AS "blockchainTransactionId"
             FROM "blockchain-transactions" rbt
             WHERE rbt.status = ${this.STATUS.RETRY_PROCESSED}
             GROUP BY rbt."orderItemId", rbt.id
         )
    SELECT bt.id, bt.action, bt.data FROM "blockchain-transactions" bt
      INNER JOIN r ON r."blockchainTransactionId" = bt.id
    WHERE r.retries < ${RETRIES_LIMIT}
      AND ${this.STATUS.EXPIRE} = (
        SELECT status FROM "blockchain-transactions" 
        WHERE "orderItemId" = bt."orderItemId" 
        ORDER BY id DESC LIMIT 1
      )
   `);
  }

  static format({
    id,
    data,
    action,
    status,
    txId,
    createdAt,
    createdBy,
    blockTime,
    feeCollected,
  }) {
    return {
      id,
      data,
      action,
      status,
      txId,
      createdAt,
      createdBy,
      blockTime,
      feeCollected,
    };
  }
}
