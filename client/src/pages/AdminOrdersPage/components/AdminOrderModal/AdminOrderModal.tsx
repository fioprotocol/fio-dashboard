import React from 'react';
import { Link } from 'react-router-dom';

import { Table } from 'react-bootstrap';

import Modal from '../../../../components/Modal/Modal';

import useContext from './AdminOrderModalContext';

import { setFioName } from '../../../../utils';
import { formatDateToLocale } from '../../../../helpers/stringFormatters';

import {
  BC_TX_STATUSES,
  BC_TX_STATUS_LABELS,
  PURCHASE_RESULTS_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_PROVIDER_LABEL,
  PAYMENT_PROVIDER,
} from '../../../../constants/purchase';
import { CURRENCY_CODES } from '../../../../constants/common';
import { ADMIN_ROUTES } from '../../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';
import { ORDER_USER_TYPES_TITLE } from '../../../../constants/order';

import apis from '../../../../api';

import { OrderDetails } from '../../../../types';

import classes from '../../styles/AdminOrderModal.module.scss';

type Props = {
  onClose: () => void;
  orderItem: OrderDetails;
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
  const { isFree, historyList, orderPayment, orderItems } = useContext({
    orderItem,
  });
  if (!orderItem) return null;

  const { orderUserType } = orderItem;

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

    if (!orderPayment.price) return 'None';

    let orderPaymentPrice =
      orderPayment.price + ` ${orderPayment.currency.toUpperCase()}`;

    if (orderPayment.currency === CURRENCY_CODES.FIO) {
      orderPaymentPrice =
        apis.fio.sufToAmount(Number(orderPayment.price)).toFixed(2) +
        ` ${orderPayment.currency.toUpperCase()}`;

      orderPaymentPrice += ` (${apis.fio.convertFioToUsdc(
        Number(orderPayment.price),
        Number(orderItem.roe),
      )} USDC)`;
    }

    return orderPaymentPrice;
  };
  let paymentType = orderPayment?.processor
    ? PAYMENT_PROVIDER_LABEL[orderPayment?.processor]
    : 'N/A';

  if (
    orderPayment?.processor === PAYMENT_PROVIDER.STRIPE &&
    orderPayment.data?.webhookData?.charges?.data[0]?.payment_method_details
      ?.type
  ) {
    paymentType = `${paymentType} - ${orderPayment.data.webhookData.charges.data[0].payment_method_details.type}`;
  }

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
            <div className="d-flex justify-content-between mb-2">
              <div className="mr-3">
                <b>User</b>
              </div>
              <div>
                {!orderItem.user?.email && !orderItem.user?.id ? (
                  orderUserType ? (
                    ORDER_USER_TYPES_TITLE[orderUserType]
                  ) : (
                    'No user data'
                  )
                ) : (
                  <Link
                    to={`${ADMIN_ROUTES.ADMIN_REGULAR_USER_DETAILS}?${QUERY_PARAMS_NAMES.USER_ID}=${orderItem.user?.id}`}
                  >
                    {orderItem.user?.email || orderItem.user?.id}
                  </Link>
                )}
              </div>
            </div>
            {renderOrderItemFieldData('Payment Type', paymentType)}
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
              orderItem.refProfileName || 'FIO App',
            )}

            <br />
            {renderOrderItemFieldData('Items', '', false)}
            <Table className="table" striped={true}>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Item</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Fee Collected</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.length
                  ? orderItems.map(item => (
                      <tr key={'itemDetails_' + item.id}>
                        <th>{item.action}</th>
                        <th>{setFioName(item.address, item.domain)}</th>
                        <th>
                          {item.price || 0} {item.priceCurrency}
                        </th>
                        <th>{item.feeCollected} FIO</th>
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
                            <div className={classes.statusMessage}>
                              {status}
                            </div>
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
