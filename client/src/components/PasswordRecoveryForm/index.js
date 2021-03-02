import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { compose } from '../../utils';
import { passwordRecovery } from '../../redux/profile/actions';

import PasswordRecoveryForm from './PasswordRecoveryForm';

const reduxConect = connect(
  null,
  { onSubmit: passwordRecovery },
);

const formConect = reduxForm({
  form: 'password-recovery',
});

export { PasswordRecoveryForm };

export default compose(
  reduxConect,
  formConect,
)(PasswordRecoveryForm);
