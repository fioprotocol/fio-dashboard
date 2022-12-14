import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';

import { loadAdminProfile } from '../../../redux/profile/actions';
import { isAdminAuthenticated } from '../../../redux/profile/selectors';

import AdminContainer from './AdminContainer';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated: isAdminAuthenticated,
  }),
  {
    loadProfile: loadAdminProfile,
  },
);

export { AdminContainer };

export default compose(reduxConnect)(AdminContainer);
