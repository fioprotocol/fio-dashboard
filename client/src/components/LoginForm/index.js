import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { login, getCachedUsers } from '../../redux/edge/actions';
import { closeLoginModal as onClose } from '../../redux/modal/actions';
import { showLogin as show } from '../../redux/modal/selectors';
import {
  loading as edgeAuthLoading,
  cachedUsers,
  loginFailure,
} from '../../redux/edge/selectors';

import LoginForm from './LoginForm';

const reduxConnect = connect(
  createStructuredSelector({
    edgeAuthLoading,
    show,
    cachedUsers,
    loginFailure,
  }),
  {
    onSubmit: login,
    onClose,
    getCachedUsers,
  },
);

export default compose(reduxConnect)(LoginForm);
