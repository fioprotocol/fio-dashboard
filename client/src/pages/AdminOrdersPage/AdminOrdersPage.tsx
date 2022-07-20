import React, { useState } from 'react';

import { Table } from 'react-bootstrap';

import Loader from '../../components/Loader/Loader';
import AdminOrderModal from './components/AdminOrderModal';
import usePagination from '../../hooks/usePagination';
import { formatDateToLocale } from '../../helpers/stringFormatters';

import { AdminUser, OrderItem } from '../../types';

import classes from './AdminOrdersListPage.module.scss';

type Props = {
  loading: boolean;
  getOrdersList: (limit?: number, offset?: number) => Promise<void>;
  adminUser: AdminUser;
  ordersList: OrderItem[];
  orderItem: OrderItem;
  ordersCount: number;
  isAuthUser: boolean;
  getOrder: (id: string) => Promise<void>;
};

// todo: create table in the database for this
const ORDER_STATUSES: { [label: string]: number } = {
  NEW: 1,
  PENDING: 2,
  PAYMENT_AWAITING: 3,
  PAID: 4,
  TRANSACTION_EXECUTED: 5,
  PARTIALLY_SUCCESS: 6,
  DONE: 7,
};

const AdminOrdersPage: React.FC<Props> = props => {
  const { loading, ordersList, getOrdersList, getOrder, orderItem } = props;

  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
    null,
  );

  const { paginationComponent } = usePagination(getOrdersList);

  const closeOrderDetails = () => {
    setShowOrderDetailsModal(false);
    setSelectedOrderItemId(null);
  };

  const openOrderDetails = async (orderId: string) => {
    await getOrder(orderId);
    setSelectedOrderItemId(orderId);
    setShowOrderDetailsModal(true);
  };

  return (
    <>
      <div className={classes.tableContainer}>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Order</th>
              <th scope="col">User</th>
              <th scope="col">Amount</th>
              <th scope="col">Wallet</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {ordersList?.length
              ? ordersList.map((order, i) => (
                  <tr
                    key={order.id}
                    className={classes.orderItem}
                    onClick={openOrderDetails.bind(null, order.id)}
                  >
                    <th>
                      {' '}
                      {order.createdAt
                        ? formatDateToLocale(order.createdAt)
                        : null}
                    </th>
                    <th>{order.number}</th>
                    <th>{order.user.email}</th>
                    <th>{order.total}</th>
                    <th>{order.publicKey}</th>
                    <th>
                      {
                        Object.entries(ORDER_STATUSES).find(
                          ([label, value]) =>
                            ORDER_STATUSES[label] === order.status,
                        )[0]
                      }
                    </th>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>

        {paginationComponent}

        <AdminOrderModal
          isVisible={
            showOrderDetailsModal && selectedOrderItemId === orderItem?.id
          }
          onClose={closeOrderDetails}
          orderItem={orderItem}
        />

        {loading && <Loader />}
      </div>
    </>
  );
};

export default AdminOrdersPage;
