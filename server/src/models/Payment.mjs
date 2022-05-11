import Sequelize from 'sequelize';

import Base from './Base';

import { Order } from './Order';
import { PaymentEventLog } from './PaymentEventLog';

const { DataTypes: DT } = Sequelize;

export class Payment extends Base {
  static get STATUS() {
    return {
      NEW: 1,
      PENDING: 2,
      COMPLETED: 3,
      EXPIRED: 4,
      CANCELLED: 5,
    };
  }
  static get CURRENCY() {
    return {
      USDC: 'USDC',
      ETH: 'ETH',
    };
  }
  static get PROCESSOR() {
    return {
      COINBASE: 'COINBASE',
      COINPAYMENTS: 'COINPAYMENTS',
      ADMIN: 'ADMIN',
    };
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        processor: {
          type: DT.STRING,
          allowNull: false,
          comment: 'COINBASE, COINPAYMENTS, ADMIN, etc',
        },
        externalId: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Payment id from processor data',
        },
        externalPaymentUrl: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Link to external payment page',
        },
        price: { type: DT.STRING, allowNull: true, comment: 'Total price' },
        currency: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Payment currency - USDC, ETH, ...',
        },
        status: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
          comment: 'NEW (1), PENDING (2), CANCELLED (5), EXPIRED (4), COMPLETED (3)',
        },
        data: { type: DT.JSON, comment: 'Any additional data for the payment' },
      },
      {
        sequelize,
        tableName: 'payments',
        paranoid: true,
        indexes: [
          {
            fields: ['id'],
          },
          {
            fields: ['status'],
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
    this.hasMany(PaymentEventLog, {
      foreignKey: 'paymentId',
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
