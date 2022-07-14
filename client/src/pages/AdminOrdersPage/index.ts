import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import AdminOrdersPage from './AdminOrdersPage';

import { compose } from '../../utils';

import {
  adminUser,
  isAdminAuthenticated as isAuthUser,
} from '../../redux/profile/selectors';
import {
  loading,
  orderItem,
  ordersCount,
  ordersList,
} from '../../redux/admin/selectors';
import { getOrder, getOrdersList } from '../../redux/admin/actions';

const reduxConnect = connect(
  createStructuredSelector({
    adminUser,
    isAuthUser,
    loading,
    ordersCount,
    ordersList,
    orderItem,
  }),
  { getOrdersList, getOrder },
);

export default compose(reduxConnect)(AdminOrdersPage);
