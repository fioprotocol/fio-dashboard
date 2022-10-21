import { commonFormatTime } from '../../util/general';
import { combinePriceWithDivider } from '../../util/prices';

import { ORDER_STATUS_LABEL_PDF } from '../../constants/purchase';

import { OrderDetailed, OrderItemDetailed } from '../../types';

type TransactionItem = {
  type: string;
  description: string;
  debit: string;
  credit: string;
  txId?: string;
};

type Props = {
  orderDetails: {
    title: string;
    items: { title: string; value: string }[];
  };
  paymentDetails: {
    title: string;
    items: { title: string; value: string }[];
  };
  transactionDetails: {
    title: string;
    regItems: TransactionItem[];
    errItems: TransactionItem[];
  };
};

export const useContext = (orderItem: OrderDetailed): Props => {
  const {
    createdAt,
    number,
    payment,
    status,
    isPartial,
    isAllErrored,
    regItems = [],
    errItems = [],
  } = orderItem || {};
  const { paidWith, regTotalCost, errTotalCost, paymentProcessor } =
    payment || {};

  const totalCostPrice = !isAllErrored ? regTotalCost : errTotalCost;

  const orderDetails = {
    title: 'Order Details',
    items: [
      {
        title: 'Date',
        value: commonFormatTime(createdAt),
      },
      {
        title: 'Order Number',
        value: number,
      },
      {
        title: 'Status',
        value: ORDER_STATUS_LABEL_PDF[status] || ORDER_STATUS_LABEL_PDF.DEFAULT,
      },
    ],
  };

  const paymentDetails = {
    title: 'Payment Details',
    items: [
      {
        title: 'Total Cost',
        value: combinePriceWithDivider({
          totalCostPrice,
          paymentProcessor,
        }),
      },
      { title: 'Paid With', value: paidWith },
    ],
  };

  if (isPartial) {
    paymentDetails.items.splice(1, 0, {
      title: 'Total Errored Cost',
      value: combinePriceWithDivider({
        totalCostPrice: errTotalCost,
        paymentProcessor,
      }),
    });
  }

  const transformOrderItemsToTransactionItems = (
    orderItems: OrderItemDetailed[],
    isCredit?: boolean,
  ): TransactionItem[] =>
    orderItems &&
    orderItems.map(orderItem => {
      const { action, id, priceString, transaction_id } = orderItem;
      let debit = '';
      let credit = '';

      if (isCredit) {
        credit = priceString;
      } else {
        debit = priceString;
      }

      return {
        description: id,
        debit,
        credit,
        type: action,
        txId: transaction_id || null,
      };
    });

  const transactionDetails = {
    title: 'Transaction Details',
    regItems: transformOrderItemsToTransactionItems(regItems),
    errItems: transformOrderItemsToTransactionItems(errItems, true),
  };

  return { orderDetails, paymentDetails, transactionDetails };
};
