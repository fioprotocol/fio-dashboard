import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import {
  loading,
  noProfileLoaded,
  isNewUser,
  isNewEmailNotVerified,
} from '../../redux/profile/selectors';
import { homePageLink } from '../../redux/refProfile/selectors';

import { createStructuredSelector } from 'reselect';

const selector = createStructuredSelector({
  noProfileLoaded,
  isNewUser,
  isNewEmailNotVerified,
  homePageLink,
  loading,
});

export default withRouter(
  connect(selector, null, null, { pure: false })(PrivateRoute),
);
