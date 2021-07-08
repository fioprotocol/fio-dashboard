import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { logout } from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { pathname } from '../../redux/router/selectors';
import {
  user,
  isAuthenticated,
  loading as profileLoading,
} from '../../redux/profile/selectors';
import { loading as edgeAuthLoading } from '../../redux/edge/selectors';
import { list as notifications } from '../../redux/notifications/selectors';
import { cartItems } from '../../redux/cart/selectors';

import MainHeader from './MainHeader';

const selector = createStructuredSelector({
  pathname,
  user,
  isAuthenticated,
  edgeAuthLoading,
  profileLoading,
  notifications,
  cartItems,
});

const actions = dispatch => ({
  showLoginModal: () => dispatch(showLoginModal()),
  logout: history => dispatch(logout({ history })),
});

export { MainHeader };

export default withRouter(connect(selector, actions)(MainHeader));
