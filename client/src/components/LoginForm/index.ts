import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import {
  login,
  getCachedUsers,
  resetLoginFailure,
} from '../../redux/edge/actions';
import { closeLoginModal as onClose } from '../../redux/modal/actions';
import { resetLastAuthData } from '../../redux/profile/actions';
import { showLogin as show } from '../../redux/modal/selectors';
import { refProfileInfo } from '../../redux/refProfile/selectors';
import {
  error as loginFailure,
  lastAuthData,
} from '../../redux/profile/selectors';
import {
  loading as edgeAuthLoading,
  cachedUsers,
  isPinEnabled,
  loginFailure as edgeLoginFailure,
} from '../../redux/edge/selectors';

import LoginForm from './LoginForm';

const reduxConnect = connect(
  createStructuredSelector({
    edgeAuthLoading,
    show,
    cachedUsers,
    edgeLoginFailure,
    isPinEnabled,
    loginFailure,
    lastAuthData,
    refProfileInfo,
  }),
  {
    onSubmit: login,
    onClose,
    getCachedUsers,
    resetLastAuthData,
    resetLoginFailure,
  },
);

export default compose(reduxConnect)(LoginForm);
