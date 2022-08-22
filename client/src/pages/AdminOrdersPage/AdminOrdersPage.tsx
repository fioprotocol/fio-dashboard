import React, { useState } from 'react';

import { Table } from 'react-bootstrap';

import Loader from '../../components/Loader/Loader';
import AdminOrderModal from './components/AdminOrderModal/AdminOrderModal';
import usePagination from '../../hooks/usePagination';
import { formatDateToLocale } from '../../helpers/stringFormatters';

import { PURCHASE_RESULTS_STATUS_LABELS } from '../../constants/purchase';

import { AdminUser, OrderItem } from '../../types';

import classes from './styles/AdminOrdersListPage.module.scss';

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
              <th scope="col">Ref Profile</th>
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
                    <th>{order.user ? order.user.email : order.userEmail}</th>
                    <th>{order.total || 0}</th>
                    <th>{order.refProfileName || 'FIO Dashboard'}</th>
                    <th>{PURCHASE_RESULTS_STATUS_LABELS[order.status]}</th>
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
