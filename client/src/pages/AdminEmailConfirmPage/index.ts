import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import { compose } from '../../utils';

import { confirmAdminEmail } from '../../redux/profile/actions';

import AdminEmailConfirmPage from './AdminEmailConfirmPage';
import { loading } from '../../redux/profile/selectors';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
  }),
  {
    confirmAdminEmail,
  },
);

export default withRouter(compose(reduxConnect)(AdminEmailConfirmPage));
