import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import AdminPrivateRoute from './AdminPrivateRoute';

import {
  loading,
  isAdminAuthenticated,
  isAuthenticated as isAuthUser,
} from '../../redux/profile/selectors';

import { compose } from '../../utils';

const reduxConnect = connect(
  createStructuredSelector({
    isAdminAuthenticated,
    isAuthUser,
    loading,
  }),
  null,
  null,
  { pure: false },
);

export default compose(reduxConnect)(AdminPrivateRoute);
