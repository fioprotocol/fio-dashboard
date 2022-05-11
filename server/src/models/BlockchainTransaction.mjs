import Sequelize from 'sequelize';

import { FIO_ACTIONS } from '../config/constants.js';

import Base from './Base';
import { OrderItem } from './OrderItem.mjs';
import { BlockchainTransactionEventLog } from './BlockchainTransactionEventLog';
import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class BlockchainTransaction extends Base {
  static get ACTION() {
    return FIO_ACTIONS;
  }
  static get STATUS_LABELS() {
    return {
      READY: 'READY',
      PENDING: 'PENDING',
      CANCEL: 'CANCEL',
      REVIEW: 'REVIEW',
      SUCCESS: 'SUCCESS',
      RETRY: 'RETRY',
      RETRY_PROCESSED: 'RETRY_PROCESSED',
      EXPIRE: 'EXPIRE',
    };
  }
  static get STATUS() {
    return {
      READY: 1,
      PENDING: 2,
      SUCCESS: 3,
      REVIEW: 4,
      CANCEL: 5,
      RETRY: 6,
      EXPIRE: 7,
      RETRY_PROCESSED: 8,
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
            'Last action processing status. READY (1) / PENDING (2) / RETRY (6) / SUCCESS (3) / REVIEW (4) / CANCEL (5) etc.',
        },
        data: { type: DT.JSON, comment: 'Any additional data' },
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

  static format({ id }) {
    return {
      id,
    };
  }
}
