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

const ERROR_TYPES = {
  default: 'default',
  freeAddressIsNotRegistered: 'freeAddressIsNotRegistered',
};

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
    // Update Order status
    try {
      const items = await OrderItemStatus.getAllItemsStatuses(orderId);

      await Order.updateStatus(
        orderId,
        null,
        items
          .filter(({ txStatus }) => txStatus !== BlockchainTransaction.STATUS.NONE)
          .map(({ txStatus }) => txStatus),
      );
    } catch (error) {
      logger.error(`ORDER STATUS UPDATE - ${orderId}`, error);
    }

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
              include: [BlockchainTransaction],
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
            const isFree = price === '0';

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
              const eventLogs = await BlockchainTransactionEventLog.findAll({
                where: {
                  blockchainTransactionId: bcTx.id,
                },
              });
              const event = eventLogs.find(
                ({ status }) =>
                  status === BlockchainTransaction.STATUS.REVIEW ||
                  status === BlockchainTransaction.STATUS.CANCEL,
              );
              this.messageData.results.errors.push({
                fioName,
                fee_collected: isFree ? null : nativeFio,
                error: event ? event.statusNotes : '',
                errorData: event.data,
                cartItemId: fioName,
                isFree,
                errorType: isFree
                  ? ERROR_TYPES.freeAddressIsNotRegistered
                  : ERROR_TYPES.default,
              });

              continue;
            }

            this.messageData.results.registered.push({
              fioName,
              fee_collected: isFree ? null : nativeFio, // todo: set fee collected from tx
              costUsdc: price,
              cartItemId: fioName,
              isFree,
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
