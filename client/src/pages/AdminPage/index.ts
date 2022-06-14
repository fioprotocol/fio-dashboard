import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { adminLogin as login } from '../../redux/profile/actions';

import {
  loading,
  adminUser,
  isAuthenticated as isAuthUser,
} from '../../redux/profile/selectors';

import AdminPage from './AdminPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    adminUser,
    isAuthUser,
  }),
  {
    login,
  },
);

export default compose(reduxConnect)(AdminPage);
