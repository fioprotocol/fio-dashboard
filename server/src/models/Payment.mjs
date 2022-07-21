import Sequelize from 'sequelize';

import { PAYMENTS_STATUSES } from '../config/constants.js';

import Base from './Base';

import { Order } from './Order';
import { PaymentEventLog } from './PaymentEventLog';

import Stripe from '../external/payment-processor/stripe.mjs';

const { DataTypes: DT } = Sequelize;

export class Payment extends Base {
  static get STATUS() {
    return PAYMENTS_STATUSES;
  }
  static get CURRENCY() {
    return {
      FIO: 'FIO',
      USDC: 'USDC',
      USD: 'USD',
      ETH: 'ETH',
    };
  }
  static get PROCESSOR() {
    return {
      COINBASE: 'COINBASE',
      COIN_PAYMENTS: 'COIN_PAYMENTS',
      CREDIT_CARD: 'CREDIT_CARD',
      FIO: 'FIO',
      ADMIN: 'ADMIN',
      SYSTEM: 'SYSTEM',
    };
  }
  static get SPENT_TYPE() {
    return {
      ORDER: 1,
      ACTION: 2,
      ACTION_REFUND: 3,
      ORDER_REFUND: 4,
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
        spentType: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
          comment:
            'Payment spent type: ORDER(1), ACTION(2), ACTION_REFUND(3), ORDER_REFUND(4)',
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
          {
            fields: ['spentType'],
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

  static getPaymentProcessor(paymentProcessor) {
    if (paymentProcessor === this.PROCESSOR.CREDIT_CARD) {
      return Stripe;
    }

    return null;
  }

  static format({
    id,
    price,
    currency,
    status,
    spentType,
    processor,
    createdAt,
    updatedAt,
    PaymentEventLogs: paymentEventLogs,
  }) {
    return {
      id,
      price,
      currency,
      status,
      spentType,
      processor,
      createdAt,
      updatedAt,
      paymentEventLogs:
        paymentEventLogs && paymentEventLogs.length
          ? paymentEventLogs.map(item => PaymentEventLog.format(item))
          : [],
    };
  }
}
