import { reduxForm } from 'redux-form';

import ResetPasswordForm from './ResetPasswordForm';

const formConect = reduxForm({
  form: 'reset-password',
});

export { ResetPasswordForm };

export default formConect(ResetPasswordForm);
