import Sequelize from 'sequelize';

import Base from '../Base';
import { fioApi } from '../../external/fio.mjs';

import {
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  BlockchainTransaction,
} from '../../models';

import X from '../Exception.mjs';

import { PAYMENTS_STATUSES } from '../../config/constants';

import logger from '../../logger.mjs';

export default class OrdersUpdate extends Base {
  static get validationRules() {
    return {
      id: 'string',
      data: [
        {
          nested_object: {
            status: 'integer',
            publicKey: 'string',
            results: [
              {
                nested_object: {
                  errors: [
                    {
                      list_of_objects: {
                        fioName: 'string',
                        error: 'string',
                        isFree: 'integer',
                        cartItemId: 'string',
                        errorType: 'string',
                      },
                    },
                  ],
                  registered: [
                    {
                      list_of_objects: {
                        fioName: 'string',
                        isFree: 'integer',
                        fee_collected: 'integer',
                        costUsdc: 'string',
                        cartItemId: 'string',
                        transaction_id: 'string',
                        transactions: { list_of: 'string' },
                        data: 'any_object',
                      },
                    },
                  ],
                  partial: { list_of: 'string' },
                  paymentProvider: 'string',
                  providerTxId: 'string',
                  paymentOption: 'string',
                  paymentAmount: 'string',
                  paymentCurrency: 'string',
                  providerTxStatus: 'string',
                },
              },
            ],
          },
        },
      ],
    };
  }

  async execute({ id, data }) {
    const order = await Order.findOne({
      where: { id, userId: this.context.id },
      include: [
        { model: OrderItem, include: [OrderItemStatus] },
        {
          model: Payment,
          where: { spentType: Payment.SPENT_TYPE.ORDER },
        },
      ],
    });

    if (!order) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          code: 'NOT_FOUND',
        },
      });
    }

    if (data.status && data.status === Order.STATUS.CANCELED) {
      await Order.update(
        { status: data.status },
        { where: { id, userId: this.context.id } },
      );
      await OrderItemStatus.update(
        { paymentStatus: PAYMENTS_STATUSES.CANCELLED },
        {
          where: {
            orderItemId: {
              [Sequelize.Op.in]: order.OrderItems.map(({ id }) => id),
            },
          },
        },
      );
      await Payment.cancelPayment(order);

      return {
        data: { success: true },
      };
    }

    const orderUpdateParams = {};
    if (data.status) orderUpdateParams.status = data.status;
    if (data.publicKey) orderUpdateParams.publicKey = data.publicKey;

    if (Object.values(orderUpdateParams).length)
      await Order.update(orderUpdateParams, { where: { id, userId: this.context.id } });

    if (data.results) {
      const processedOrderItems = [];
      for (const regItem of data.results.registered) {
        const { fioName, data: itemData } = regItem;

        const orderItem = order.OrderItems.find(
          ({ id, address, domain }) =>
            !processedOrderItems.includes(id) &&
            fioApi.setFioName(address, domain) === fioName,
        );

        if (orderItem && itemData) {
          await OrderItem.update(
            { data: { ...(orderItem.data ? orderItem.data : {}), ...itemData } },
            { where: { id: orderItem.id } },
          );
          processedOrderItems.push(orderItem.id);
        }
      }
    }

    if (data.results && data.results.paymentProvider === Payment.PROCESSOR.FIO) {
      try {
        const totalFioNativePrice = data.results.registered.reduce((acc, regItem) => {
          if (!isNaN(Number(regItem.fee_collected))) return acc + regItem.fee_collected;
          return acc;
        }, 0);

        await Payment.update(
          {
            status: Payment.STATUS.COMPLETED,
            price: totalFioNativePrice || null,
            currency: Payment.PROCESSOR.FIO,
          },
          {
            where: { id: order.Payments[0].id },
          },
        );

        for (const orderItem of order.OrderItems) {
          const bcTx = await BlockchainTransaction.create({
            action: orderItem.action,
            status: BlockchainTransaction.STATUS.READY,
            data: { params: orderItem.params },
            orderItemId: orderItem.id,
          });

          await OrderItemStatus.update(
            {
              paymentStatus: Payment.STATUS.COMPLETED,
              txStatus: BlockchainTransaction.STATUS.READY,
              blockchainTransactionId: bcTx.id,
            },
            {
              where: {
                orderItemId: orderItem.id,
                paymentId: order.Payments[0].id,
                txStatus: BlockchainTransaction.STATUS.NONE,
              },
            },
          );
        }
      } catch (e) {
        logger.error(`ORDER UPDATE ERROR ${order.id} #${order.number} - ${e.message}`);
      }
    }

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return [];
  }
}
