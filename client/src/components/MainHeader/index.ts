import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { logout, resetLastAuthData } from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { locationState, pathname } from '../../redux/navigation/selectors';

import {
  isAuthenticated,
  isNotActiveUser,
  loading as profileLoading,
  profileRefreshed,
  user,
} from '../../redux/profile/selectors';
import { loading as edgeAuthLoading } from '../../redux/edge/selectors';
import { list as notifications } from '../../redux/notifications/selectors';
import { fioAddresses } from '../../redux/fio/selectors';
import { cartItems } from '../../redux/cart/selectors';
import {
  loading as refProfileLoading,
  refProfileInfo,
  isNoProfileFlow,
} from '../../redux/refProfile/selectors';
import { isContainedFlow } from '../../redux/containedFlow/selectors';

import MainHeader from './MainHeader';

import { MainHeaderProps } from './types';
import { AppDispatch } from '../../redux/init';
import { OwnPropsAny } from '../../types';

const selector = createStructuredSelector({
  pathname,
  user,
  isAuthenticated,
  profileRefreshed,
  isNotActiveUser,
  edgeAuthLoading,
  profileLoading,
  notifications,
  cartItems,
  refProfileInfo,
  refProfileLoading,
  fioAddresses,
  locationState,
  isContainedFlow,
  isNoProfileFlow,
});

const actions = (
  dispatch: AppDispatch,
  ownProps: MainHeaderProps & OwnPropsAny,
) => ({
  showLoginModal: () => dispatch(showLoginModal()),
  logout: () => {
    dispatch(logout());
    dispatch(resetLastAuthData());
  },
});

export default withRouter(connect(selector, actions)(MainHeader));
