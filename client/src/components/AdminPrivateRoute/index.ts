import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import AdminPrivateRoute from './AdminPrivateRoute';

import {
  adminProfileRefreshed,
  isAdminAuthenticated,
  loading,
} from '../../redux/profile/selectors';

import { compose } from '../../utils';

const reduxConnect = connect(
  createStructuredSelector({
    isAdminAuthenticated,
    adminProfileRefreshed,
    loading,
  }),
  null,
  null,
  { pure: false },
);

export default compose(reduxConnect)(AdminPrivateRoute);
