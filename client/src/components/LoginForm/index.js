import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { loading } from '../../redux/edge/selectors';
import { login } from '../../redux/edge/actions';
import { showLogin as show } from '../../redux/modal/selectors';
import { closeLoginModal as onClose } from '../../redux/modal/actions'; 

import LoginForm from './LoginForm';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    show,
  }),
  {
    onSubmit: login,
    onClose,
  }
);

export default compose(
  reduxConnect,
)(LoginForm);
