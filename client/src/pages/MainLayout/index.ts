import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getCart } from '../../redux/cart/actions';
import { edgeContextInit } from '../../redux/edge/actions';
import { loadProfile, logout, loginGuest } from '../../redux/profile/actions';
import { getApiUrls } from '../../redux/registrations/actions';
import { showRecoveryModal } from '../../redux/modal/actions';
import { getSiteSettings } from '../../redux/settings/actions';
import { pathname } from '../../redux/navigation/selectors';

import { cartId } from '../../redux/cart/selectors';
import {
  isAuthenticated,
  isActiveUser,
  profileRefreshed,
} from '../../redux/profile/selectors';
import { loginSuccess, edgeContextSet } from '../../redux/edge/selectors';
import { showLogin, showRecovery } from '../../redux/modal/selectors';
import { isContainedFlow } from '../../redux/containedFlow/selectors';
import { apiUrls } from '../../redux/registrations/selectors';
import {
  isNoProfileFlow,
  loading as refProfileLoading,
} from '../../redux/refProfile/selectors';

import MainLayout from './MainLayout';

const reduxConnect = connect(
  createStructuredSelector({
    cartId,
    pathname,
    isAuthenticated,
    profileRefreshed,
    isActiveUser,
    isNoProfileFlow,
    loginSuccess,
    showLogin,
    showRecovery,
    edgeContextSet,
    isContainedFlow,
    apiUrls,
    refProfileLoading,
  }),
  {
    edgeContextInit,
    getCart,
    showRecoveryModal,
    loadProfile,
    getApiUrls,
    logout,
    loginGuest,
    getSiteSettings,
  },
);

export { MainLayout };

export default compose(reduxConnect)(MainLayout);
