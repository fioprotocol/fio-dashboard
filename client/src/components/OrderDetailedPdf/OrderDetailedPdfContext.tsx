import { commonFormatTime } from '../../util/general';
import { combinePriceWithDivider } from '../../util/prices';
import { setFioName } from '../../utils';

import { ORDER_STATUS_LABEL_PDF } from '../../constants/purchase';

import { OrderDetailed, OrderItemDetailed } from '../../types';

type TransactionItem = {
  type: string;
  description: string;
  debit: string;
  credit: string;
  txId?: string;
  txIds?: string[];
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
  };
};

export const useContext = (orderItem: OrderDetailed): Props => {
  const { createdAt, number, payment, status, regItems = [] } = orderItem || {};
  const { paidWith, regTotalCost } = payment || {};

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
          totalCostPrice: regTotalCost,
        }),
      },
      { title: 'Paid With', value: paidWith },
    ],
  };

  const transformOrderItemsToTransactionItems = (
    orderItems: OrderItemDetailed[],
    isCredit?: boolean,
  ): TransactionItem[] =>
    orderItems &&
    orderItems.map(orderItem => {
      const {
        action,
        address,
        domain,
        priceString,
        transaction_id,
        transaction_ids,
      } = orderItem;
      let debit = '';
      let credit = '';

      if (isCredit) {
        credit = priceString;
      } else {
        debit = priceString;
      }

      return {
        description: setFioName(address, domain),
        debit,
        credit,
        type: action,
        txId: transaction_id || null,
        txIds: transaction_ids || [],
      };
    });

  const transactionDetails = {
    title: 'Transaction Details',
    regItems: transformOrderItemsToTransactionItems(regItems),
  };

  return { orderDetails, paymentDetails, transactionDetails };
};
