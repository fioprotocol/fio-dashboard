import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import AdminHomePage from './AdminHomePage';

import { compose } from '../../utils';

import { adminUser } from '../../redux/profile/selectors';

const reduxConnect = connect(
  createStructuredSelector({
    adminUser,
  }),
  {},
);

export default compose(reduxConnect)(AdminHomePage);
