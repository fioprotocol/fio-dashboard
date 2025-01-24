import Sequelize from 'sequelize';

import Base from './Base';

import { BlockchainTransaction } from './BlockchainTransaction.mjs';
import { Payment } from './Payment.mjs';
import { OrderItem } from './OrderItem.mjs';

const { DataTypes: DT } = Sequelize;

// This is helper table to reduce query time,
// it is storing current status state of order items based on payments and blockchain-transactions table statuses
export class OrderItemStatus extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        paymentStatus: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
          comment: 'NEW (1), PENDING (2), CANCELLED (5), EXPIRED (4), COMPLETED (3)',
        },
        txStatus: {
          type: DT.INTEGER,
          defaultValue: 1,
          comment:
            'Last action processing status. READY (1) / PENDING (2) / RETRY (6) / SUCCESS (3) / FAILED (4) / CANCEL (5) etc.',
        },
      },
      {
        sequelize,
        tableName: 'order-items-status',
        paranoid: true,
        indexes: [
          {
            fields: ['id'],
          },
          {
            fields: ['txStatus'],
          },
          {
            fields: ['paymentStatus'],
          },
          {
            fields: ['txStatus', 'paymentStatus'],
          },
          {
            fields: ['orderItemId'],
          },
          {
            fields: ['blockchainTransactionId'],
          },
          {
            fields: ['paymentId'],
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
    this.belongsTo(Payment, {
      foreignKey: 'paymentId',
      targetKey: 'id',
    });
    this.belongsTo(OrderItem, {
      foreignKey: 'orderItemId',
      targetKey: 'id',
    });
  }

  static list(where) {
    return this.findAll({
      where,
      order: [['id', 'ASC']],
    });
  }

  static async getAllItemsStatuses(orderId) {
    return this.sequelize.query(
      `
        SELECT 
          oi.id, 
          ois."txStatus",
          ois."paymentStatus"
        FROM "order-items" oi
          INNER JOIN "order-items-status" ois ON ois."orderItemId" = oi.id
        WHERE oi."orderId" = :orderId
      `,
      {
        replacements: { orderId },
        type: this.sequelize.QueryTypes.SELECT,
      },
    );
  }

  static format({
    id,
    paymentStatus,
    blockchainTransactionId,
    txStatus,
    createdAt,
    paymentId,
    orderItemId,
  }) {
    return {
      id,
      paymentStatus,
      blockchainTransactionId,
      createdAt,
      paymentId,
      txStatus,
      orderItemId,
    };
  }
}
