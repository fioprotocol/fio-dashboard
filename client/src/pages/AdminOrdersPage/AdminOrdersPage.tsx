import React, { useState } from 'react';

import { Table } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';

import Loader from '../../components/Loader/Loader';
import AdminOrderModal from './components/AdminOrderModal';
import useEffectOnce from '../../hooks/general';
import { formatDateToLocale } from '../../helpers/stringFormatters';
import { AdminUser, OrderItem } from '../../types';

import classes from './AdminOrdersListPage.module.scss';

type Props = {
  loading: boolean;
  getOrdersList: (limit?: number, offset?: number) => void;
  adminUser: AdminUser;
  ordersList: OrderItem[];
  orderItem: OrderItem;
  ordersCount: number;
  isAuthUser: boolean;
  getOrder: (id: string) => Promise<void>;
};

const MAX_ORDERS_PER_PAGE = 25;

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
  const {
    loading,
    ordersList,
    getOrdersList,
    ordersCount = 0,
    getOrder,
    orderItem,
  } = props;

  const [activePage, setActivePage] = useState(1);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
    null,
  );

  useEffectOnce(() => {
    getOrdersList();
  }, [getOrdersList]);

  const closeOrderDetails = () => {
    setShowOrderDetailsModal(false);
    setSelectedOrderItemId(null);
  };

  const openOrderDetails = async (orderId: string) => {
    await getOrder(orderId);
    setSelectedOrderItemId(orderId);
    setShowOrderDetailsModal(true);
  };

  const paginationItems = [];
  for (
    let pageNumber = 1;
    pageNumber <=
    (ordersCount > MAX_ORDERS_PER_PAGE ? ordersCount / MAX_ORDERS_PER_PAGE : 1);
    pageNumber++
  ) {
    paginationItems.push(
      <Pagination.Item
        key={pageNumber}
        active={pageNumber === activePage}
        onClick={() => {
          if (!(pageNumber === activePage)) {
            setActivePage(pageNumber);
            getOrdersList(
              MAX_ORDERS_PER_PAGE,
              (pageNumber - 1) * MAX_ORDERS_PER_PAGE,
            );
          }
        }}
      >
        {pageNumber}
      </Pagination.Item>,
    );
  }

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

        <Pagination>{paginationItems}</Pagination>

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
