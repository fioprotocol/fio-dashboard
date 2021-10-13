import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { edgeContextInit } from '../../redux/edge/actions';
import { loadProfile } from '../../redux/profile/actions';
import { showRecoveryModal } from '../../redux/modal/actions';
import { pathname } from '../../redux/navigation/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';
import { loginSuccess, edgeContextSet } from '../../redux/edge/selectors';
import { showLogin, showRecovery } from '../../redux/modal/selectors';

import MainLayout from './MainLayout';

const selector = createStructuredSelector({
  pathname,
  isAuthenticated,
  loginSuccess,
  showLogin,
  showRecovery,
  edgeContextSet,
});

const actions = dispatch => ({
  init: () => {
    dispatch(loadProfile());
    dispatch(edgeContextInit());
  },
  showRecoveryModal: () => dispatch(showRecoveryModal()),
});

export { MainLayout };

export default connect(selector, actions)(MainLayout);
