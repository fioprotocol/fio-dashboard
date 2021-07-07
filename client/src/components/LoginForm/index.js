import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { login, getCachedUsers } from '../../redux/edge/actions';
import { closeLoginModal as onClose } from '../../redux/modal/actions';
import { showLogin as show } from '../../redux/modal/selectors';
import { error as loginFailure } from '../../redux/profile/selectors';
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
  }),
  {
    onSubmit: login,
    onClose,
    getCachedUsers,
  },
);

export default compose(reduxConnect)(LoginForm);
