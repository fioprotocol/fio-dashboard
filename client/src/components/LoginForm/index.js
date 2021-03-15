import { connect } from 'react-redux';

import { compose } from '../../utils';
import { login } from '../../redux/profile/actions';

import LoginForm from './LoginForm';

const reduxConect = connect(
  null,
  null,
);

export default compose(
  reduxConect,
)(LoginForm);
