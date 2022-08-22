import { setFioName } from '../../../../utils';
import { formatDateToLocale } from '../../../../helpers/stringFormatters';

import apis from '../../../../api';

import {
  BC_TX_STATUSES,
  BC_TX_STATUS_LABELS,
  PAYMENT_SPENT_TYPES,
  PAYMENT_SPENT_TYPES_ORDER_HISTORY_LABEL,
  PURCHASE_RESULTS_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENTS_STATUSES_TITLES,
  PAYMENT_OPTIONS,
} from '../../../../constants/purchase';
import {
  BcTx,
  OrderItem,
  OrderPaymentItem,
  PaymentOptionsProps,
} from '../../../../types';

type PaymentSpentType = typeof PAYMENT_SPENT_TYPES[keyof typeof PAYMENT_SPENT_TYPES];
type PaymentStatusType = typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES];
type HistoryListItem = {
  key: string;
  date: string;
  amount: string;
  currency?: string;
  withdraw?: boolean;
  status: string;
  dateTime: number;
};

export const PAYMENT_OPTION_LABEL = {
  [PAYMENT_OPTIONS.FIO]: 'FIO',
  [PAYMENT_OPTIONS.CREDIT_CARD]: 'Stripe',
  [PAYMENT_OPTIONS.CRYPTO]: '-',
};

const setHistory = (
  order: OrderItem,
  payment: OrderPaymentItem,
): HistoryListItem[] => {
  const history: HistoryListItem[] = [
    {
      key: `order-${new Date(order.createdAt).getTime()}`,
      date: formatDateToLocale(order.createdAt),
      amount: '0.00',
      status: 'Order created',
      dateTime: new Date(order.createdAt).getTime(),
    },
    {
      key: `order-${new Date(order.updatedAt).getTime()}`,
      date: formatDateToLocale(order.updatedAt),
      amount: '0.00',
      status: `Order status update: ${
        PURCHASE_RESULTS_STATUS_LABELS[order.status]
      }.`,
      dateTime: new Date(order.updatedAt).getTime(),
    },
  ];

  if (!payment) return history;

  payment.paymentEventLogs.forEach(({ createdAt, status }) => {
    history.push({
      key: `payment-event-log-${new Date(createdAt).getTime()}`,
      date: formatDateToLocale(createdAt),
      amount: status === PAYMENT_STATUSES.COMPLETED ? payment.price : '0.00',
      currency: payment.currency.toUpperCase(),
      status: `${
        PAYMENT_OPTION_LABEL[payment.processor as PaymentOptionsProps]
      } notification received (${
        payment.externalId
      }) \nStatus: ${PAYMENTS_STATUSES_TITLES[status as PaymentStatusType] ||
        PAYMENTS_STATUSES_TITLES[PAYMENT_STATUSES.PENDING]}`,
      dateTime: new Date(createdAt).getTime(),
    });
  });

  order.payments.forEach(
    ({ price, currency, status, createdAt, spentType, paymentEventLogs }) => {
      if (spentType !== PAYMENT_SPENT_TYPES.ORDER)
        history.push({
          key: `payment-${new Date(createdAt).getTime()}`,
          date: formatDateToLocale(createdAt),
          amount: price,
          currency: currency.toUpperCase(),
          withdraw: spentType !== PAYMENT_SPENT_TYPES.ACTION_REFUND,
          status: `${
            PAYMENT_SPENT_TYPES_ORDER_HISTORY_LABEL[
              spentType as PaymentSpentType
            ]
          } ${
            paymentEventLogs && paymentEventLogs.length
              ? paymentEventLogs[0].statusNotes
              : 'action'
          }`,
          dateTime: new Date(createdAt).getTime(),
        });
    },
  );

  order.blockchainTransactionEvents.forEach(
    ({ id, blockchainTransactionId, status, statusNotes, createdAt }) => {
      let bt: BcTx = { id: 0, txId: '', action: '' };
      let statusMsg = '';
      const orderItem = order.items.find(({ blockchainTransactions }) => {
        bt = blockchainTransactions?.find(
          ({ id }) => id === blockchainTransactionId,
        );
        return !!bt;
      });
      statusMsg += `${setFioName(
        orderItem.address,
        orderItem.domain,
      )} \nstatus update: ${BC_TX_STATUS_LABELS[status]}. \nAction: ${
        bt.action
      }. \nMessage: `;

      if (statusNotes) {
        statusMsg += statusNotes;
      } else {
        if (status === BC_TX_STATUSES.SUCCESS) {
          statusMsg += `TX ID - ${bt.txId}`;
          statusMsg += `\nFee collected: ${
            bt?.feeCollected
              ? `${apis.fio.sufToAmount(bt.feeCollected)} FIO`
              : 'N/A'
          }`;
        } else {
          statusMsg += ' -';
        }
      }

      history.push({
        key: `bc-event-${id}-${new Date(createdAt).getTime()}`,
        date: formatDateToLocale(createdAt),
        amount: '0.00',
        status: statusMsg,
        dateTime: new Date(createdAt).getTime(),
      });
    },
  );

  return history.sort(({ dateTime: date1 }, { dateTime: date2 }) =>
    date1 >= date2 ? 1 : -1,
  );
};

export const useContext = ({
  orderItem,
}: {
  orderItem: OrderItem;
}): {
  isFree: boolean;
  historyList: HistoryListItem[];
  orderPayment: OrderPaymentItem | null;
} => {
  if (!orderItem) return { isFree: false, historyList: [], orderPayment: null };

  const orderPayment = orderItem.payments.find(
    ({ spentType }) => spentType === PAYMENT_SPENT_TYPES.ORDER,
  );
  const isFree = orderItem.total === '0' || !orderItem.total;
  const historyList = setHistory(orderItem, orderPayment);

  return {
    isFree,
    historyList,
    orderPayment,
  };
};

export default useContext;
