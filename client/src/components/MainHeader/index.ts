import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { logout, resetLastAuthData } from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { pathname, locationState } from '../../redux/navigation/selectors';
import {
  user,
  isAuthenticated,
  isNotActiveUser,
  profileRefreshed,
  loading as profileLoading,
} from '../../redux/profile/selectors';
import { loading as edgeAuthLoading } from '../../redux/edge/selectors';
import { list as notifications } from '../../redux/notifications/selectors';
import { fioAddresses } from '../../redux/fio/selectors';
import { cartItems } from '../../redux/cart/selectors';
import {
  refProfileInfo,
  loading as refProfileLoading,
} from '../../redux/refProfile/selectors';
import { isContainedFlow } from '../../redux/containedFlow/selectors';

import { ROUTES } from '../../constants/routes';

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
});

const actions = (
  dispatch: AppDispatch,
  ownProps: MainHeaderProps & OwnPropsAny,
) => ({
  showLoginModal: () => dispatch(showLoginModal()),
  logout: () => {
    const { history, isAdminAuthenticated } = ownProps;
    dispatch(
      logout(
        { history },
        isAdminAuthenticated ? ROUTES.ADMIN_HOME : ROUTES.HOME,
      ),
    );
    dispatch(resetLastAuthData());
  },
});

export default withRouter(connect(selector, actions)(MainHeader));
