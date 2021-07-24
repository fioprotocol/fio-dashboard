import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import {
  login,
  getCachedUsers,
  clearCachedUser,
} from '../../redux/edge/actions';
import { closeLoginModal as onClose } from '../../redux/modal/actions';
import { resetLastAuthData } from '../../redux/profile/actions';
import { showLogin as show } from '../../redux/modal/selectors';
import {
  error as loginFailure,
  lastAuthData,
} from '../../redux/profile/selectors';
import {
  loading as edgeAuthLoading,
  cachedUsers,
  loginFailure as edgeLoginFailure,
} from '../../redux/edge/selectors';

import LoginForm from './LoginForm';

const reduxConnect = connect(
  createStructuredSelector({
    edgeAuthLoading,
    show,
    cachedUsers,
    edgeLoginFailure,
    loginFailure,
    lastAuthData,
  }),
  {
    onSubmit: login,
    onClose,
    getCachedUsers,
    clearCachedUser,
    resetLastAuthData,
  },
);

export default compose(reduxConnect)(LoginForm);
