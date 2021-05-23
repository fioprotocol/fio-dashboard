import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { pathname } from '../../redux/router/selectors';
import { user } from '../../redux/profile/selectors';
import { account, loading } from '../../redux/edge/selectors';
import { list as notifications } from '../../redux/notifications/selectors';
import { logout } from '../../redux/edge/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { cartItems } from '../../redux/cart/selectors';

import MainHeader from './MainHeader';

const selector = createStructuredSelector({
  pathname,
  user,
  account,
  loading,
  notifications,
  cartItems,
});

const actions = dispatch => ({
  showLoginModal: () => dispatch(showLoginModal()),
  logout: account => dispatch(logout(account)),
});

export { MainHeader };

export default connect(selector, actions)(MainHeader);
