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

import logger from '../../logger.mjs';

export default class OrdersUpdate extends Base {
  static get validationRules() {
    return {
      id: 'string',
      publicKey: 'string',
      data: [
        {
          nested_object: {
            status: 'string',
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
                  purchaseProvider: 'string',
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

    await Order.update(
      { status: data.status },
      { where: { id, userId: this.context.id } },
    );

    if (data.results && data.results.paymentOption === Payment.PROCESSOR.FIO) {
      try {
        // todo: do we need to create PaymentEventLog here?
        await Payment.update(
          { status: Payment.STATUS.COMPLETED },
          { where: { id: order.Payments[0].id } },
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
              bcTx.status = BlockchainTransaction.STATUS.REVIEW;
              await bcTx.save();
            } else {
              bcTx = await BlockchainTransaction.create({
                action: orderItem.action,
                status: BlockchainTransaction.STATUS.REVIEW,
                data: { params: orderItem.params },
                orderItemId: orderItem.id,
              });
              blockchainTransactionId = bcTx.id;
            }

            await OrderItemStatus.update(
              {
                txStatus: BlockchainTransaction.STATUS.REVIEW,
                blockchainTransactionId,
              },
              { where: { id: orderItem.OrderItemStatus.id } },
            );

            await BlockchainTransactionEventLog.create({
              status: BlockchainTransaction.STATUS.REVIEW,
              statusNotes: error,
              blockchainTransactionId,
            });
          }
        }

        // todo: handle item with custom domain
        for (const regItem of data.results.registered) {
          const { fioName, transaction_id } = regItem;

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

              bcTx.txId = transaction_id || 'free';
              bcTx.status = BlockchainTransaction.STATUS.SUCCESS;
              await bcTx.save();
            } else {
              bcTx = await BlockchainTransaction.create({
                txId: transaction_id || 'free',
                action: orderItem.action,
                status: BlockchainTransaction.STATUS.SUCCESS,
                data: { params: orderItem.params },
                orderItemId: orderItem.id,
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
      } catch (e) {
        logger.error(`ORDER UPDATE ERROR ${order.id} #${order.number} - ${e.message}`);
      }
    }

    if (data.results && data.results.paymentOption === Payment.PROCESSOR.CREDIT_CARD) {
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
