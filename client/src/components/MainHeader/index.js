import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { logout, resetLastAuthData } from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { clearCachedUser } from '../../redux/edge/actions';
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

const actions = (dispatch, ownProps) => ({
  showLoginModal: () => dispatch(showLoginModal()),
  logout: () => {
    const { history } = ownProps;
    dispatch(logout({ history }));
    dispatch(getState => {
      try {
        const { username } = getState(state => state.profile.lastAuthData);
        dispatch(clearCachedUser(username));
      } catch (e) {
        //
      }
      return resetLastAuthData();
    });
  },
});

export { MainHeader };

export default withRouter(connect(selector, actions)(MainHeader));
