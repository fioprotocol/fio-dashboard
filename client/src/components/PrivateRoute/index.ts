import { connect } from 'react-redux';
// import { withRouter } from 'react-router';
import { createStructuredSelector } from 'reselect';

import PrivateRoute from './PrivateRoute';

import {
  loading,
  noProfileLoaded,
  isNewUser,
  isNewEmailNotVerified,
} from '../../redux/profile/selectors';
import { homePageLink } from '../../redux/refProfile/selectors';

import { compose } from '../../utils';

const reduxConnect = connect(
  createStructuredSelector({
    noProfileLoaded: state => noProfileLoaded(state),
    isNewUser: state => isNewUser(state),
    isNewEmailNotVerified: state => isNewEmailNotVerified(state),
    homePageLink,
    loading,
  }),
  null,
  null,
  { pure: false },
);

// export default withRouter(compose(reduxConnect)(PrivateRoute));
export default compose(reduxConnect)(PrivateRoute);
