import React from 'react';

import { Table } from 'react-bootstrap';

import Modal from '../../../../components/Modal/Modal';

import { setFioName } from '../../../../utils';
import { formatDateToLocale } from '../../../../helpers/stringFormatters';

import {
  BC_TX_STATUSES,
  BC_TX_STATUS_LABELS,
  PURCHASE_RESULTS_STATUS_LABELS,
  PAYMENT_STATUSES,
} from '../../../../constants/purchase';
import { OrderItem } from '../../../../types';
import { CURRENCY_CODES } from '../../../../constants/common';
import useContext from './AdminOrderModalContext';

type Props = {
  onClose: () => void;
  orderItem: OrderItem;
  isVisible: boolean;
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

const AdminOrderModal: React.FC<Props> = ({
  isVisible,
  onClose,
  orderItem,
}) => {
  const { isFree, historyList, orderPayment } = useContext({ orderItem });

  if (!orderItem) return null;

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
  const renderPaymentReceived = () => {
    if (orderPayment.status !== PAYMENT_STATUSES.COMPLETED) return '-';

    return orderPayment.price
      ? orderPayment.price + ` ${orderPayment.currency.toUpperCase()}`
      : 'None';
  };

  return (
    <Modal
      show={isVisible}
      closeButton={true}
      isSimple={true}
      isFullWidth={true}
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
              isFree ? 'Free' : orderItem.total + ' ' + CURRENCY_CODES.USDC,
            )}
            {renderOrderItemFieldData('User', orderItem.user.email)}
            {renderOrderItemFieldData(
              'Payment Type',
              orderPayment?.processor || null,
            )}
            {renderOrderItemFieldData(
              'Status',
              PURCHASE_RESULTS_STATUS_LABELS[orderItem.status],
            )}
            {renderOrderItemFieldData(
              'Payments received',
              renderPaymentReceived(),
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
                        <th>{setFioName(item.address, item.domain)}</th>
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
                          <th>
                            <div className="">{status}</div>
                          </th>
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
