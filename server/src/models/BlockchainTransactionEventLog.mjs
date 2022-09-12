import Sequelize from 'sequelize';

import Base from './Base';

import { BlockchainTransaction } from './BlockchainTransaction.mjs';

const { DataTypes: DT } = Sequelize;

export class BlockchainTransactionEventLog extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        status: {
          type: DT.INTEGER,
          defaultValue: 1,
          comment:
            'READY (1) / PENDING (2) / RETRY (6) / SUCCESS (3) / FAILED (4) / CANCEL (5) etc. A "REVIEW" is an unexpected system or broadcast exception. An "EXPIRE" will resend several times and move to "SUCCESS" or "REVIEW".  The admin will "REVIEW" then "RETRY" or "CANCEL".',
        },
        statusNotes: { type: DT.STRING, comment: 'Status details' },
        data: { type: DT.JSON, comment: 'Any additional data for the item' },
      },
      {
        sequelize,
        tableName: 'blockchain-transaction-event-logs',
        paranoid: true,
        indexes: [
          {
            fields: ['status'],
          },
          {
            fields: ['blockchainTransactionId'],
          },
        ],
      },
    );
  }

  static associate() {
    this.belongsTo(BlockchainTransaction, {
      foreignKey: 'blockchainTransactionId',
      targetKey: 'id',
    });
  }

  static list(where) {
    return this.findAll({
      where,
      order: [['id', 'ASC']],
    });
  }

  static format({ id, ...rest }) {
    return {
      id,
      ...rest,
    };
  }
}
