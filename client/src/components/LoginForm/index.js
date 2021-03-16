import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect";

import { compose } from '../../utils';
import { loading } from '../../redux/edge/selectors';
import { login } from '../../redux/edge/actions';

import LoginForm from './LoginForm';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
  }),
  { onSubmit: login },
);

export default compose(
  reduxConnect,
)(LoginForm);
