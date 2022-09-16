import apis from '../../../../api';

import MathOp from '../../../../util/math';
import { setFioName } from '../../../../utils';
import { formatDateToLocale } from '../../../../helpers/stringFormatters';

import {
  BC_TX_STATUSES,
  BC_TX_STATUS_LABELS,
  PAYMENT_SPENT_TYPES,
  PAYMENT_SPENT_TYPES_ORDER_HISTORY_LABEL,
  PURCHASE_RESULTS_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENTS_STATUSES_TITLES,
  PURCHASE_PROVIDER_LABEL,
} from '../../../../constants/purchase';
import { CURRENCY_CODES } from '../../../../constants/common';
import { ACTIONS } from '../../../../constants/fio';

import {
  BcTx,
  OrderItem,
  OrderPaymentItem,
  PaymentEventLog,
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

const generatePaymentEventLogsNotes = (eventLogs: PaymentEventLog[]) => {
  if (!eventLogs || eventLogs.length === 0) return '';

  const last = eventLogs.sort(({ id: id1 }, { id: id2 }) =>
    id1 < id2 ? 1 : -1,
  )[0];

  const { statusNotes, data: eventData } = last;

  let notes = '';
  if (statusNotes) notes += `\n${statusNotes}`;
  if (eventData) {
    if (eventData.fioTxId) notes += `\nTX ID: ${eventData.fioTxId}`;
    if (eventData.fioFee)
      notes += `\nFee collected: ${apis.fio
        .sufToAmount(new MathOp(eventData.fioFee).toNumber())
        .toString()} ${CURRENCY_CODES.FIO}`;
    if (eventData.error) notes += `\n${JSON.stringify(eventData.error)}`;
  }

  return notes;
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
      status: 'Order status: created',
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
        PURCHASE_PROVIDER_LABEL[payment.processor]
      } notification received (${
        payment.externalId
      }) \nPayment status: ${PAYMENTS_STATUSES_TITLES[
        status as PaymentStatusType
      ] || PAYMENTS_STATUSES_TITLES[PAYMENT_STATUSES.PENDING]}`,
      dateTime: new Date(createdAt).getTime(),
    });
  });

  order.payments.forEach(
    ({
      price,
      currency,
      status,
      createdAt,
      spentType,
      data,
      paymentEventLogs,
    }) => {
      if (spentType !== PAYMENT_SPENT_TYPES.ORDER) {
        const amount =
          currency === CURRENCY_CODES.FIO
            ? apis.fio.convertFioToUsdc(
                apis.fio.amountToSUF(new MathOp(price).toNumber()),
                new MathOp(data && data.roe ? data.roe : order.roe).toNumber(),
              )
            : price;

        history.push({
          key: `payment-${new Date(createdAt).getTime()}`,
          date: formatDateToLocale(createdAt),
          amount: new MathOp(amount).toString(),
          currency:
            currency === CURRENCY_CODES.FIO
              ? CURRENCY_CODES.USDC
              : currency.toUpperCase(),
          withdraw: spentType !== PAYMENT_SPENT_TYPES.ACTION_REFUND,
          status: `${
            PAYMENT_SPENT_TYPES_ORDER_HISTORY_LABEL[
              spentType as PaymentSpentType
            ]
          } ${data && data.fioName ? data.fioName : 'action'} ${
            data && data.action ? `Action: ${data.action}` : ''
          }${
            data && data.sendingFioTokens
              ? `\nTransfer Tokens\nAmount: ${price} ${CURRENCY_CODES.FIO}`
              : ''
          }${generatePaymentEventLogsNotes(paymentEventLogs)}`,
          dateTime: new Date(createdAt).getTime(),
        });
      }
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

      statusMsg += `Item ${setFioName(
        bt.action === ACTIONS.registerFioDomain ? '' : orderItem.address,
        orderItem.domain,
      )} status update: ${BC_TX_STATUS_LABELS[status]}. \nAction: ${
        bt.action
      }. \nMessage: `;

      if (statusNotes) {
        statusMsg += `${statusNotes}\n`;
      }

      if (status === BC_TX_STATUSES.SUCCESS) {
        statusMsg += `TX ID - ${bt.txId || 'N/A'}`;
        statusMsg += `\nFee collected: ${
          bt?.feeCollected
            ? `${apis.fio.sufToAmount(bt.feeCollected).toFixed(2)} FIO`
            : 'N/A'
        }`;
      } else {
        statusMsg += ' -';
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
