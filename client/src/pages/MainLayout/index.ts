import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { edgeContextInit } from '../../redux/edge/actions';
import { loadProfile } from '../../redux/profile/actions';
import { getApiUrls } from '../../redux/registrations/actions';
import { showRecoveryModal } from '../../redux/modal/actions';
import { pathname } from '../../redux/navigation/selectors';
import { isAuthenticated, isActiveUser } from '../../redux/profile/selectors';
import { loginSuccess, edgeContextSet } from '../../redux/edge/selectors';
import { showLogin, showRecovery } from '../../redux/modal/selectors';
import { isContainedFlow } from '../../redux/containedFlow/selectors';
import { apiUrls } from '../../redux/registrations/selectors';

import MainLayout from './MainLayout';

const reduxConnect = connect(
  createStructuredSelector({
    pathname,
    isAuthenticated,
    isActiveUser,
    loginSuccess,
    showLogin,
    showRecovery,
    edgeContextSet,
    isContainedFlow,
    apiUrls,
  }),
  {
    edgeContextInit,
    showRecoveryModal,
    loadProfile,
    getApiUrls,
  },
);

export { MainLayout };

export default compose(reduxConnect)(MainLayout);
