import React from 'react';

import { TableWrapper } from './TableWrapper/TableWrapper';

import { formatDateToLocale } from '../../../helpers/stringFormatters';

import { CURRENCY_CODES } from '../../../constants/common';
import { PURCHASE_RESULTS_STATUS_LABELS } from '../../../constants/purchase';

import { OrderDefault } from '../../../types';

type Props = {
  orders: OrderDefault[];
  handleOrderClick: (id: string) => void;
};

export const UserOrders: React.FC<Props> = props => {
  const { orders, handleOrderClick } = props;

  return (
    <TableWrapper title="Orders">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Order ID</th>
          <th scope="col">Amount</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders?.length ? (
          orders.map(order => {
            const total =
              order.total == null
                ? 'Free'
                : order.total + ' ' + CURRENCY_CODES.USDC;

            return (
              <tr key={order.id}>
                <th>{formatDateToLocale(order.createdAt)}</th>
                <th
                  className="text-primary"
                  onClick={() => handleOrderClick(order.id)}
                >
                  {order.number}
                </th>
                <th>{total}</th>
                <th>{PURCHASE_RESULTS_STATUS_LABELS[order.status]}</th>
              </tr>
            );
          })
        ) : (
          <tr>
            <th className="mt-3 ml-3">No Orders</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        )}
      </tbody>
    </TableWrapper>
  );
};
