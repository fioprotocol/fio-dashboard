import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { pathname } from '../../redux/router/selectors';
import { logout } from '../../redux/profile/actions';
import { user } from '../../redux/profile/selectors';
import {
  account,
  loginSuccess,
  edgeContextSet,
} from '../../redux/edge/selectors';
import { edgeContextInit } from '../../redux/edge/actions';
import { showLogin, showRecovery } from '../../redux/modal/selectors';
import { showRecoveryModal } from '../../redux/modal/actions';

import MainLayout from './MainLayout';

const selector = createStructuredSelector({
  pathname,
  user,
  account,
  loginSuccess,
  showLogin,
  showRecovery,
  edgeContextSet,
});

const actions = dispatch => ({
  init: () => {
    // dispatch(loadProfile()); // todo: if jwt exists, show PIN modal to edge pinLogin?
    dispatch(edgeContextInit());
  },
  logout: () => dispatch(logout()),
  showRecoveryModal: () => dispatch(showRecoveryModal()),
});

export { MainLayout };

export default connect(selector, actions)(MainLayout);
