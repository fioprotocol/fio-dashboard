import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { adminLogin as login } from '../../redux/profile/actions';

import { loading, isAdminAuthenticated } from '../../redux/profile/selectors';

import AdminLoginPage from './AdminLoginPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    isAdminAuthenticated,
  }),
  {
    login,
  },
);

export default compose(reduxConnect)(AdminLoginPage);
