import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AdminOrderModal from '../../AdminOrdersPage/components/AdminOrderModal/AdminOrderModal';

import { PURCHASE_RESULTS_STATUS_LABELS } from '../../../constants/purchase';
import { ADMIN_ROUTES } from '../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';
import { formatDateToLocale } from '../../../helpers/stringFormatters';

import { AdminOrderItemProfile, OrderDetails } from '../../../types';

import classes from '.././AdminSearchResultPage.module.scss';

type Props = {
  orders?: AdminOrderItemProfile[];
  getOrder: (id: string) => Promise<void>;
  orderItem: OrderDetails;
};

const AdminOrdersSearchResult: React.FC<Props> = props => {
  const { orders, getOrder, orderItem } = props;

  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
    null,
  );

  const closeOrderDetails = () => {
    setShowOrderDetailsModal(false);
    setSelectedOrderItemId(null);
  };

  const openOrderDetails = async (orderId: string) => {
    await getOrder(orderId);
    setSelectedOrderItemId(orderId);
    setShowOrderDetailsModal(true);
  };

  if (!orders?.length) return null;

  return (
    <div>
      <div className="my-3">
        <div className={classes.itemTitle}>Orders</div>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Order</th>
              <th scope="col">User</th>
              <th scope="col">Amount</th>
              <th scope="col">Payment</th>
              <th scope="col">Wallet</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id} className={classes.userItem}>
                <th>
                  {order.createdAt ? formatDateToLocale(order.createdAt) : null}
                </th>
                <th
                  className={classes.link}
                  onClick={openOrderDetails.bind(null, order.id)}
                >
                  {order.number}
                </th>
                <th>
                  <Link
                    to={`${ADMIN_ROUTES.ADMIN_REGULAR_USER_DETAILS}?${QUERY_PARAMS_NAMES.USER_ID}=${orderItem.user.id}`}
                  >
                    {order.userEmail || order.userId}
                  </Link>
                </th>
                <th>{order.total}</th>
                <th>{order.paymentProcessor}</th>
                <th>{order.publicKey || null}</th>
                <th>{PURCHASE_RESULTS_STATUS_LABELS[order.status]}</th>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <AdminOrderModal
        isVisible={
          showOrderDetailsModal && selectedOrderItemId === orderItem?.id
        }
        onClose={closeOrderDetails}
        orderItem={orderItem}
      />
    </div>
  );
};

export default AdminOrdersSearchResult;
