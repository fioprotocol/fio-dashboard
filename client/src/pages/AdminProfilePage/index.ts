import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import {
  adminUser,
  isAdminAuthenticated as isAuthUser,
} from '../../redux/profile/selectors';

import AdminProfilePage from './AdminProfilePage';

const reduxConnect = connect(
  createStructuredSelector({
    adminUser,
    isAuthUser,
  }),
  {},
);

export default compose(reduxConnect)(AdminProfilePage);
