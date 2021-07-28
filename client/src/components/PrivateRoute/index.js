import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import { loading, noProfileLoaded } from '../../redux/profile/selectors';

import { createStructuredSelector } from 'reselect';

const selector = createStructuredSelector({
  noProfileLoaded,
  loading,
});

export default withRouter(
  connect(selector, null, null, { pure: false })(PrivateRoute),
);
