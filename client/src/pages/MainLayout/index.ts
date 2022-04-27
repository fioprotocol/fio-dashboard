import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { edgeContextInit } from '../../redux/edge/actions';
import { loadProfile } from '../../redux/profile/actions';
import { showRecoveryModal } from '../../redux/modal/actions';
import { pathname } from '../../redux/navigation/selectors';
import { isAuthenticated, isActiveUser } from '../../redux/profile/selectors';
import { loginSuccess, edgeContextSet } from '../../redux/edge/selectors';
import { showLogin, showRecovery } from '../../redux/modal/selectors';

import MainLayout from './MainLayout';

import { AppDispatch } from '../../redux/init';

const selector = createStructuredSelector({
  pathname,
  isAuthenticated,
  isActiveUser,
  loginSuccess,
  showLogin,
  showRecovery,
  edgeContextSet,
});

const actions = (dispatch: AppDispatch) => ({
  init: () => {
    dispatch(loadProfile());
    dispatch(edgeContextInit());
  },
  showRecoveryModal: () => dispatch(showRecoveryModal()),
});

export { MainLayout };

export default connect(selector, actions)(MainLayout);
