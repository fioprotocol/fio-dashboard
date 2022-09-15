import Base from '../Base';
import { fioApi } from '../../external/fio.mjs';

import {
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
} from '../../models';

import X from '../Exception.mjs';

import { checkOrderStatusAndCreateNotification } from '../updateOrderStatus.mjs';

import logger from '../../logger.mjs';

export default class OrdersUpdate extends Base {
  static get validationRules() {
    return {
      id: 'string',
      data: [
        {
          nested_object: {
            status: 'string',
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

    const orderUpdateParams = {};
    if (data.status) orderUpdateParams.status = data.status;
    if (data.publicKey) orderUpdateParams.publicKey = data.publicKey;

    if (Object.values(orderUpdateParams).length)
      await Order.update(orderUpdateParams, { where: { id, userId: this.context.id } });

    if (data.results && data.results.paymentProvider === Payment.PROCESSOR.FIO) {
      try {
        const totalFioNativePrice = data.results.registered.reduce((acc, regItem) => {
          if (!isNaN(Number(regItem.fee_collected))) return acc + regItem.fee_collected;
          return acc;
        }, 0);

        // todo: do we need to create PaymentEventLog here?
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

        // todo: check data.results.partial
        for (const errorItem of data.results.errors) {
          const { fioName, error } = errorItem;
          const orderItem = order.OrderItems.find(
            ({ address, domain }) => fioApi.setFioName(address, domain) === fioName,
          );

          if (orderItem) {
            let blockchainTransactionId =
              orderItem.OrderItemStatus.blockchainTransactionId;
            let bcTx = null;
            if (blockchainTransactionId) {
              bcTx = await BlockchainTransaction.findOneWhere({
                id: blockchainTransactionId,
              });
              bcTx.status = BlockchainTransaction.STATUS.FAILED;
              await bcTx.save();
            } else {
              bcTx = await BlockchainTransaction.create({
                action: orderItem.action,
                status: BlockchainTransaction.STATUS.FAILED,
                data: { params: orderItem.params },
                orderItemId: orderItem.id,
              });
              blockchainTransactionId = bcTx.id;
            }

            await OrderItemStatus.update(
              {
                txStatus: BlockchainTransaction.STATUS.FAILED,
                blockchainTransactionId,
              },
              { where: { id: orderItem.OrderItemStatus.id } },
            );

            await BlockchainTransactionEventLog.create({
              status: BlockchainTransaction.STATUS.FAILED,
              statusNotes: error,
              blockchainTransactionId,
            });
          }
        }

        // todo: handle item with custom domain
        for (const regItem of data.results.registered) {
          const { fioName, transaction_id, fee_collected } = regItem;

          const orderItem = order.OrderItems.find(
            ({ address, domain }) => fioApi.setFioName(address, domain) === fioName,
          );

          if (orderItem) {
            let blockchainTransactionId =
              orderItem.OrderItemStatus.blockchainTransactionId;
            let bcTx = null;
            if (blockchainTransactionId) {
              bcTx = await BlockchainTransaction.findOneWhere({
                id: blockchainTransactionId,
              });

              bcTx.txId = transaction_id;
              bcTx.status = BlockchainTransaction.STATUS.SUCCESS;
              bcTx.feeCollected = fee_collected;
              await bcTx.save();
            } else {
              bcTx = await BlockchainTransaction.create({
                txId: transaction_id,
                action: orderItem.action,
                status: BlockchainTransaction.STATUS.SUCCESS,
                data: { params: orderItem.params },
                orderItemId: orderItem.id,
                feeCollected: fee_collected,
              });
              blockchainTransactionId = bcTx.id;
            }

            await OrderItemStatus.update(
              {
                txStatus: bcTx.status,
                blockchainTransactionId,
              },
              { where: { id: orderItem.OrderItemStatus.id } },
            );

            await BlockchainTransactionEventLog.create({
              status: bcTx.status,
              statusNotes: '',
              blockchainTransactionId,
            });
          }
        }
        await checkOrderStatusAndCreateNotification(id);
      } catch (e) {
        logger.error(`ORDER UPDATE ERROR ${order.id} #${order.number} - ${e.message}`);
      }
    }

    if (data.results && data.results.paymentProvider === Payment.PROCESSOR.STRIPE) {
      for (const regItem of data.results.registered) {
        const { fioName, data: itemData } = regItem;

        const orderItem = order.OrderItems.find(
          ({ address, domain }) => fioApi.setFioName(address, domain) === fioName,
        );

        if (orderItem && itemData) {
          await OrderItem.update(
            { data: { ...(orderItem.data ? orderItem.data : {}), ...itemData } },
            { where: { id: orderItem.id } },
          );
        }
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
