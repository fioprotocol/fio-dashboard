import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { compose } from '../../utils';

import LoginPinForm from './LoginPinForm';

const reduxConect = connect(
  null,
  null
);

const formConect = reduxForm({
  form: 'loginPin',
});

export default compose(
  reduxConect,
  formConect,
)(LoginPinForm);
