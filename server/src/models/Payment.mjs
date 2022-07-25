import Sequelize from 'sequelize';

import Base from './Base';

import { Order } from './Order';
import { PaymentEventLog } from './PaymentEventLog';
import { BlockchainTransaction } from './BlockchainTransaction';
import { OrderItemStatus } from './OrderItemStatus';

import Stripe from '../external/payment-processor/stripe.mjs';

import logger from '../logger.mjs';
import X from '../services/Exception.mjs';

const { DataTypes: DT } = Sequelize;

import { PAYMENTS_STATUSES } from '../config/constants.js';

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

  static async createForOrder(order, paymentProcessorKey, orderItems) {
    const paymentProcessor = Payment.getPaymentProcessor(paymentProcessorKey);
    let orderPayment = {};
    let extPaymentParams = {};

    const exPayment = await Payment.findOne({
      where: {
        status: Payment.STATUS.NEW,
        spentType: Payment.SPENT_TYPE.ORDER,
        orderId: order.id,
      },
    });

    // Remove existing payment when trying to create new one for the order
    if (exPayment) {
      try {
        const pExtId = exPayment.externalId;
        await exPayment.destroy({ force: true });
        if (pExtId) await paymentProcessor.cancel(pExtId);
      } catch (e) {
        logger.error(
          `Existing Payment removing error ${e.message}. Order #${order.number}. Payment ${exPayment.id}`,
        );
      }
    }

    try {
      await Payment.sequelize.transaction(async t => {
        orderPayment = await Payment.create(
          {
            price: extPaymentParams.amount,
            currency: extPaymentParams.currency,
            status: Payment.STATUS.NEW,
            processor: paymentProcessorKey,
            externalId: '',
            orderId: order.id,
          },
          { transaction: t },
        );

        for (const orderItem of orderItems) {
          await OrderItemStatus.create(
            {
              txStatus: BlockchainTransaction.STATUS.NONE,
              paymentStatus: orderPayment.status,
              blockchainTransactionId: null,
              paymentId: orderPayment.id,
              orderItemId: orderItem.id,
            },
            { transaction: t },
          );
        }

        if (paymentProcessor) {
          extPaymentParams = await paymentProcessor.create({
            amount: order.total,
            orderNumber: order.number,
          });
          orderPayment.externalId = extPaymentParams.externalPaymentId;
          await orderPayment.save({ transaction: t });
        }
      });
    } catch (e) {
      if (paymentProcessor && extPaymentParams.secret) {
        await paymentProcessor.cancel(extPaymentParams.externalPaymentId);
      }

      logger.error(`Payment creation error ${e.message}. Order #${order.number}`);

      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          paymentProcessor: 'SERVER_ERROR',
        },
      });
    }

    return {
      id: orderPayment.id,
      ...extPaymentParams,
    };
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
