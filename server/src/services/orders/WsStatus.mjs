import WsBase from '../WsBase';

import {
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
} from '../../models';

import { FIO_ADDRESS_DELIMITER } from '../../config/constants.js';

import logger from '../../logger.mjs';

export default class WsStatus extends WsBase {
  constructor(args) {
    super(args);

    this.WAIT_PERIOD_MS = 3000;
    this.messageData = {
      orderStatus: 0,
      paymentStatus: 0,
    };
  }

  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            orderId: 'integer',
          },
        },
      ],
    };
  }

  async watch({ data: { orderId } }) {
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: this.context.id,
      },
      include: [
        {
          model: Payment,
          where: { spentType: Payment.SPENT_TYPE.ORDER },
        },
        {
          model: OrderItem,
          include: [
            {
              model: OrderItemStatus,
              include: [
                {
                  model: BlockchainTransaction,
                  include: [BlockchainTransactionEventLog],
                },
              ],
            },
          ],
        },
      ],
    });

    try {
      if (
        this.messageData.orderStatus !== order.status ||
        this.messageData.paymentStatus !== order.Payments[0].status
      ) {
        this.messageData.orderStatus = order.status;
        this.messageData.paymentStatus = order.Payments[0].status;

        try {
          this.messageData.results = {
            errors: [],
            registered: [],
            partial: [],
          };
          for (const orderItem of order.OrderItems) {
            const { address, domain, price, nativeFio } = orderItem;
            const itemStatus = orderItem.OrderItemStatus;
            let bcTx = {};

            if (itemStatus.blockchainTransactionId) {
              bcTx = itemStatus.BlockchainTransaction;
            }

            const fioName = address
              ? `${address}${FIO_ADDRESS_DELIMITER}${domain}`
              : domain;

            if (
              itemStatus.txStatus === BlockchainTransaction.STATUS.REVIEW ||
              itemStatus.txStatus === BlockchainTransaction.STATUS.CANCEL
            ) {
              const event = bcTx.BlockchainTransactionEventLogs.find(
                ({ status }) =>
                  status === BlockchainTransaction.STATUS.REVIEW ||
                  status === BlockchainTransaction.STATUS.CANCEL,
              );
              this.messageData.results.errors.push({
                fioName,
                error: event ? event.statusNotes : '',
                cartItemId: fioName,
                errorType: 'default',
              });

              continue;
            }

            this.messageData.results.registered.push({
              fioName,
              fee_collected: nativeFio, // todo: set fee collected from tx
              costUsdc: price,
              cartItemId: fioName,
              transaction_id: bcTx.txId,
            });
          }
        } catch (e) {
          logger.error(`WS ERROR. Order items set. ${orderId}. ${e}`);
        }

        this.send(
          JSON.stringify({
            data: this.messageData,
          }),
        );
      }
    } catch (e) {
      logger.error(`WS ERROR. Order status. ${orderId}. ${e}`);
    }
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return [];
  }
}
