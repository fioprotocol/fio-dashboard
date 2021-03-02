import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { compose } from '../../utils';
import { login } from '../../redux/profile/actions';

import LoginForm from './LoginForm';

const reduxConect = connect(
  null,
  null,
  // { onSubmit: login },
);

const formConect = reduxForm({
  form: 'login',
});

export { LoginForm };

export default compose(
  reduxConect,
  formConect,
)(LoginForm);
