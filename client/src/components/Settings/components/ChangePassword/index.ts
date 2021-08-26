import { reduxForm } from 'redux-form';

import ChangePassword from './ChangePassword';
import validate from './validation';

const formConnect = reduxForm({
  form: 'changePassword',
  getFormState: state => state.reduxForm,
  validate,
});

export default formConnect(ChangePassword);
