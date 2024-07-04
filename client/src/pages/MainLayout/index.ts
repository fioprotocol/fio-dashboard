import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getCart } from '../../redux/cart/actions';
import { edgeContextInit } from '../../redux/edge/actions';
import { loadProfile, logout } from '../../redux/profile/actions';
import { getApiUrls } from '../../redux/registrations/actions';
import { showRecoveryModal } from '../../redux/modal/actions';
import { pathname } from '../../redux/navigation/selectors';

import { cartId } from '../../redux/cart/selectors';
import { isAuthenticated, isActiveUser } from '../../redux/profile/selectors';
import { loginSuccess, edgeContextSet } from '../../redux/edge/selectors';
import { showLogin, showRecovery } from '../../redux/modal/selectors';
import { isContainedFlow } from '../../redux/containedFlow/selectors';
import { apiUrls } from '../../redux/registrations/selectors';
import { isNoProfileFlow } from '../../redux/refProfile/selectors';

import MainLayout from './MainLayout';

const reduxConnect = connect(
  createStructuredSelector({
    cartId,
    pathname,
    isAuthenticated,
    isActiveUser,
    isNoProfileFlow,
    loginSuccess,
    showLogin,
    showRecovery,
    edgeContextSet,
    isContainedFlow,
    apiUrls,
  }),
  {
    edgeContextInit,
    getCart,
    showRecoveryModal,
    loadProfile,
    getApiUrls,
    logout,
  },
);

export { MainLayout };

export default compose(reduxConnect)(MainLayout);
