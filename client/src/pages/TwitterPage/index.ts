import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { setRedirectPath } from '../../redux/navigation/actions';
import { showLoginModal } from '../../redux/modal/actions';

import { cartItems } from '../../redux/cart/selectors';
import { isAuthenticated, lastAuthData } from '../../redux/profile/selectors';
import { refProfileInfo } from '../../redux/refProfile/selectors';

import TwitterPage from './TwitterPage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    refProfileInfo,
    lastAuthData,
    cartItems,
  }),
  {
    setRedirectPath,
    showLoginModal,
  },
);

export { TwitterPage };

export default withRouter(compose(reduxConnect)(TwitterPage));
