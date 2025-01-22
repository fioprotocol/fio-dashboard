import Sequelize from 'sequelize';

import Base from './Base';

import { Order } from './Order';
import { PaymentEventLog } from './PaymentEventLog';
import { BlockchainTransaction } from './BlockchainTransaction';
import { OrderItemStatus } from './OrderItemStatus';
import { User } from './User.mjs';

import BitPay from '../external/payment-processor/bitpay.mjs';
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
      BITPAY: 'BITPAY',
      STRIPE: 'STRIPE',
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
        price: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Total price',
        },
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
        data: {
          type: DT.JSON,
          comment: 'Any additional data for the payment',
        },
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
    if (paymentProcessor === this.PROCESSOR.STRIPE) {
      return Stripe;
    }

    if (paymentProcessor === this.PROCESSOR.BITPAY) {
      return BitPay;
    }

    return null;
  }

  static async cancelPayment(order, seqOpt = {}) {
    const payment = await Payment.findOne({
      where: {
        status: Payment.STATUS.NEW,
        spentType: Payment.SPENT_TYPE.ORDER,
        orderId: order.id,
      },
      ...seqOpt,
    });

    // Remove existing payment when trying to create new one for the order
    if (payment) {
      try {
        const pExtId = payment.externalId;
        const pExtPaymentProcessor = Payment.getPaymentProcessor(payment.processor);

        payment.status = Payment.STATUS.CANCELLED;
        await payment.save(seqOpt);
        if (pExtId && pExtPaymentProcessor) await pExtPaymentProcessor.cancel(pExtId);
      } catch (e) {
        logger.error(
          `Existing Payment removing error ${e.message}. Order #${order.number}. Payment ${payment.id}`,
        );
      }
    }
  }

  static async createForOrder(order, paymentProcessorKey, orderItems) {
    const paymentProcessor = Payment.getPaymentProcessor(paymentProcessorKey);

    let orderPayment = await Payment.findOne({
      where: {
        status: Payment.STATUS.NEW,
        spentType: Payment.SPENT_TYPE.ORDER,
        orderId: order.id,
      },
    });

    let extPaymentParams = {};

    try {
      await Payment.sequelize.transaction(async t => {
        if (!orderPayment) {
          orderPayment = await Payment.create(
            {
              status: Payment.STATUS.NEW,
              processor: paymentProcessorKey,
              externalId: '',
              orderId: order.id,
            },
            { transaction: t },
          );

          if (paymentProcessor) {
            const user = await User.findByPk(order.userId);

            extPaymentParams = await paymentProcessor.create({
              amount: order.total,
              orderNumber: order.number,
              buyer: user && user.email,
            });

            orderPayment.externalId = extPaymentParams.externalPaymentId;
            orderPayment.amount = extPaymentParams.amount;
            orderPayment.currency = extPaymentParams.currency;
            orderPayment.data = {
              ...orderPayment.data,
              secret: extPaymentParams.secret,
            };

            await orderPayment.save({ transaction: t });
          }
        }

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

    if (extPaymentParams.forceInitialWebhook && extPaymentParams.externalPaymentId) {
      await paymentProcessor.getInvoiceWebHook(extPaymentParams.externalPaymentId);
    }

    return {
      id: orderPayment.id,
      processor: paymentProcessorKey,
      ...extPaymentParams,
    };
  }

  static async getOrderPayment(orderId) {
    return Payment.findOne({
      where: { orderId: orderId, spentType: Payment.SPENT_TYPE.ORDER },
      order: [['createdAt', 'DESC']],
    });
  }

  static format({
    id,
    price,
    currency,
    externalId,
    status,
    data,
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
      externalId,
      status,
      data,
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
