import React from 'react';

import { Table } from 'react-bootstrap';

import Modal from '../../../components/Modal/Modal';

import { FIO_ADDRESS_DELIMITER } from '../../../utils';
import { formatDateToLocale } from '../../../helpers/stringFormatters';

import {
  BC_TX_STATUS_LABELS,
  PAYMENT_SPENT_TYPES,
  PAYMENT_SPENT_TYPES_ORDER_HISTORY_LABEL,
  PURCHASE_RESULTS_TITLES,
  PAYMENT_STATUSES,
  PAYMENTS_STATUSES_TITLES,
  PAYMENT_OPTIONS,
  PURCHASE_RESULTS_STATUS,
  BC_TX_STATUSES,
} from '../../../constants/purchase';
import {
  OrderItem,
  OrderPaymentItem,
  PaymentOptionsProps,
} from '../../../types';
import { CURRENCY_CODES } from '../../../constants/common';

type Props = {
  onClose: () => void;
  orderItem: OrderItem;
  isVisible: boolean;
};

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

const renderOrderItemFieldData = (
  label: string,
  value: string | number,
  withBorder = true,
) => (
  <div
    className={`d-flex justify-content-between mb-2 ${
      withBorder ? 'border-bottom' : ''
    }`}
  >
    <div className="mr-3">
      <b>{label}</b>
    </div>
    <div>{value}</div>
  </div>
);

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
  ];

  if (!payment) return history;

  payment.paymentEventLogs.forEach(({ createdAt, status }) => {
    history.push({
      key: `payment-event-log-${new Date(createdAt).getTime()}`,
      date: formatDateToLocale(createdAt),
      amount: status === PAYMENT_STATUSES.COMPLETED ? payment.price : '0.00',
      currency: payment.currency,
      status: `${
        PAYMENT_OPTION_LABEL[payment.processor as PaymentOptionsProps]
      } notification received (${
        payment.externalId
      } Status: ${PAYMENTS_STATUSES_TITLES[status as PaymentStatusType] ||
        PAYMENTS_STATUSES_TITLES[2]}`,
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
          currency,
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
    ({ id, status, statusNotes, createdAt }) => {
      history.push({
        key: `bc-event-${id}-${new Date(createdAt).getTime()}`,
        date: formatDateToLocale(createdAt),
        amount: '0.00',
        status: `Status: ${
          BC_TX_STATUS_LABELS[status]
        }. Message: ${statusNotes || '-'}`,
        dateTime: new Date(createdAt).getTime(),
      });
    },
  );

  return history.sort(({ dateTime: date1 }, { dateTime: date2 }) =>
    date1 >= date2 ? 1 : -1,
  );
};

const AdminOrderModal: React.FC<Props> = ({
  isVisible,
  onClose,
  orderItem,
}) => {
  if (!orderItem) return null;

  const orderPayment = orderItem.payments.find(
    ({ spentType }) => spentType === PAYMENT_SPENT_TYPES.ORDER,
  );
  const historyList = setHistory(orderItem, orderPayment);
  const renderHistoryPrice = (
    amount: string,
    currency: string,
    withdraw?: boolean,
  ) => {
    if (withdraw)
      return (
        <>
          <span className="text-danger">({amount})</span>{' '}
          {currency || CURRENCY_CODES.USDC}{' '}
        </>
      );

    return amount + ` ${currency || CURRENCY_CODES.USDC}`;
  };

  return (
    <Modal
      show={isVisible}
      closeButton={true}
      isSimple={true}
      isWide={true}
      hasDefaultCloseColor={true}
      onClose={onClose}
    >
      <div className="d-flex flex-column w-100">
        <h3 className="text-left mb-3">{orderItem?.number}</h3>
        {orderItem ? (
          <>
            {renderOrderItemFieldData(
              'Date',
              formatDateToLocale(orderItem.createdAt),
            )}
            {renderOrderItemFieldData(
              'Order Amount',
              orderItem.total +
                ' ' +
                (orderItem.items?.[0]?.priceCurrency || ''),
            )}
            {renderOrderItemFieldData('User', orderItem.user.email)}
            {renderOrderItemFieldData(
              'Payment Type',
              orderPayment?.processor || null,
            )}
            {renderOrderItemFieldData(
              'Status',
              PURCHASE_RESULTS_TITLES[orderItem.status]
                ? PURCHASE_RESULTS_TITLES[orderItem.status].title
                : PURCHASE_RESULTS_TITLES[PURCHASE_RESULTS_STATUS.PENDING]
                    .title,
            )}
            {renderOrderItemFieldData(
              'Payments received',
              orderPayment.status === PAYMENT_STATUSES.COMPLETED
                ? orderPayment.price + ` ${orderPayment.currency}`
                : '-',
            )}
            {renderOrderItemFieldData(
              'Ref Profile',
              orderItem.refProfileName || 'FIO Dashboard',
            )}

            <br />
            {renderOrderItemFieldData('Items', '', false)}
            <Table className="table" striped={true}>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Item</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {orderItem.items?.length
                  ? orderItem.items.map((item, i) => (
                      <tr key={'itemDetails_' + item.id}>
                        <th>{item.action}</th>
                        <th>
                          {(item.address
                            ? item.address + FIO_ADDRESS_DELIMITER
                            : '') + item.domain}
                        </th>
                        <th>{item.price || 0 + ' ' + item.priceCurrency}</th>
                        <th>
                          {BC_TX_STATUS_LABELS[item.orderItemStatus.txStatus] ||
                            BC_TX_STATUS_LABELS[BC_TX_STATUSES.NONE]}
                        </th>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>

            {renderOrderItemFieldData('History', '', false)}
            <Table className="table" striped={true}>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                {historyList?.length
                  ? historyList.map(
                      ({ key, date, amount, currency, status, withdraw }) => (
                        <tr key={'history-item-' + key}>
                          <th>{date}</th>
                          <th>
                            {renderHistoryPrice(amount, currency, withdraw)}
                          </th>
                          <th>{status}</th>
                        </tr>
                      ),
                    )
                  : null}
              </tbody>
            </Table>
          </>
        ) : null}
      </div>
    </Modal>
  );
};

export default AdminOrderModal;
