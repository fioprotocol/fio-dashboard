import React from 'react';

import { Link } from 'react-router-dom';

import { TableWrapper } from './TableWrapper/TableWrapper';

import { formatDateToLocale } from '../../../helpers/stringFormatters';

import { CURRENCY_CODES } from '../../../constants/common';
import { PURCHASE_RESULTS_STATUS_LABELS } from '../../../constants/purchase';
import { ROUTES } from '../../../constants/routes';

import { OrderDefault } from '../../../types';

type Props = {
  orders: OrderDefault[];
};

export const UserOrders: React.FC<Props> = props => {
  const { orders } = props;

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
                <th>
                  <Link
                    to={{
                      pathname: ROUTES.ADMIN_ORDERS,
                      state: {
                        orderId: order.id,
                      },
                    }}
                  >
                    {order.number}
                  </Link>
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
