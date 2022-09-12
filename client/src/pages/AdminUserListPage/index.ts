import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import {
  getAdminUserProfile,
  getAdminUsersList,
  removeAdminUser,
} from '../../redux/admin/actions';

import {
  adminUserProfile,
  adminUsersCount,
  adminUsersList,
  loading,
} from '../../redux/admin/selectors';

import AdminUserListPage from './AdminUserListPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    adminUsersList,
    adminUsersCount,
    adminUserProfile,
  }),
  {
    getAdminList: getAdminUsersList,
    getAdminUserProfile,
    removeAdminUser,
  },
);

export default compose(reduxConnect)(AdminUserListPage);
