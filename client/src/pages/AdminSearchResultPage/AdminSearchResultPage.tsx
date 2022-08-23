import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

import Loader from '../../components/Loader/Loader';
import AdminOrderModal from '../AdminOrdersPage/components/AdminOrderModal/AdminOrderModal';
import AdminUserModal from './components/AdminUserModal/AdminUserModal';

import { formatDateToLocale } from '../../helpers/stringFormatters';
import { PURCHASE_RESULTS_STATUS_LABELS } from '../../constants/purchase';

import {
  AdminSearchResult,
  AdminUserItemProfile,
  OrderItem,
} from '../../types';

import classes from './AdminSearchResultPage.module.scss';

type Props = {
  adminSearch?: AdminSearchResult;
  loading: boolean;
  orderItem: OrderItem;
  getOrder: (id: string) => Promise<void>;
};

const AdminPage: React.FC<Props> = props => {
  const { adminSearch, loading, getOrder, orderItem } = props;

  const [userItem, setUserItem] = useState<AdminUserItemProfile | null>(null);

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

  const closeUserDetails = () => {
    setUserItem(null);
  };

  const openUserDetails = async (user: AdminUserItemProfile) => {
    setUserItem(user);
  };

  if (loading) return <Loader />;

  return (
    <>
      {!adminSearch?.result ||
      (!adminSearch.result.users?.length &&
        !adminSearch.result.orders?.length) ? (
        <div className={classes.infoTitle}>Nothing found</div>
      ) : (
        <div>
          <div className={classes.infoTitle}>Search results</div>
          {adminSearch.result.orders && (
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
                  {adminSearch.result.orders.map((order, i) => (
                    <tr
                      key={order.id}
                      className={classes.userItem}
                      onClick={openOrderDetails.bind(null, order.id)}
                    >
                      <th>
                        {order.createdAt
                          ? formatDateToLocale(order.createdAt)
                          : null}
                      </th>
                      <th>{order.number}</th>
                      <th>{order.userEmail}</th>
                      <th>{order.total}</th>
                      <th>{order.paymentProcessor}</th>
                      <th>
                        {order.blockchainData?.owner_fio_public_key || null}
                      </th>
                      <th>{PURCHASE_RESULTS_STATUS_LABELS[order.status]}</th>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {adminSearch.result.users && (
            <div className="my-3">
              <div className={classes.itemTitle}>Users</div>
              <Table className="table" striped={true}>
                <thead>
                  <tr>
                    <th scope="col">Created</th>
                    <th scope="col">User</th>
                  </tr>
                </thead>
                <tbody>
                  {adminSearch.result.users.map((user, i) => (
                    <tr
                      key={user.id}
                      className={classes.userItem}
                      onClick={openUserDetails.bind(null, user)}
                    >
                      <th>
                        {user.createdAt
                          ? formatDateToLocale(user.createdAt)
                          : null}
                      </th>
                      <th>{user.email}</th>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <AdminOrderModal
            isVisible={
              showOrderDetailsModal && selectedOrderItemId === orderItem?.id
            }
            onClose={closeOrderDetails}
            orderItem={orderItem}
          />

          <AdminUserModal
            isVisible={!!userItem}
            onClose={closeUserDetails}
            userItem={userItem}
          />
        </div>
      )}
    </>
  );
};

export default AdminPage;
