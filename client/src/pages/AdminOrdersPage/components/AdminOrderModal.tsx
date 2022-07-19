import React from 'react';

import { Table } from 'react-bootstrap';

import Modal from '../../../components/Modal/Modal';

import { FIO_ADDRESS_DELIMITER } from '../../../utils';
import { formatDateToLocale } from '../../../helpers/stringFormatters';

import { OrderItem } from '../../../types';

type Props = {
  onClose: () => void;
  orderItem: OrderItem;
  isVisible: boolean;
};

const renderOrderItemFieldData = (label: string, value: string | number) => (
  <div className="d-flex justify-content-between">
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
              orderItem.payments?.[0]?.processor || null,
            )}
            {renderOrderItemFieldData('Wallet', orderItem.publicKey)}

            <br />
            {renderOrderItemFieldData('Items', '')}
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
                        <th>{item.price + ' ' + item.priceCurrency}</th>
                        <th>{null}</th>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>

            {renderOrderItemFieldData('History', '')}
            <Table className="table" striped={true}>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                {orderItem.payments?.length
                  ? orderItem.payments.map((payment, i) => (
                      <tr key={'paymentDetails_' + payment.id}>
                        <th>{formatDateToLocale(payment.createdAt)}</th>
                        <th>{payment.price + ' USDC'}</th>
                        <th>{payment.status}</th>
                      </tr>
                    ))
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
