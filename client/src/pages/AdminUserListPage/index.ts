import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getAdminList, removeAdminUser } from '../../redux/admin/actions';

import { loading, adminUsersList } from '../../redux/admin/selectors';

import AdminUserListPage from './AdminUserListPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    adminUsersList,
  }),
  {
    getAdminList,
    removeAdminUser,
  },
);

export default compose(reduxConnect)(AdminUserListPage);
