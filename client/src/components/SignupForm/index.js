import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { createSelector, createStructuredSelector } from 'reselect';
import { compose } from '../../utils';
import { signup, resetSuccessState } from '../../redux/profile/actions';
import { successfullyRegistered, loading } from '../../redux/profile/selectors';
import { withRouter } from 'react-router-dom';
import SignupForm from './SignupForm';

const signupSuccess = createSelector(
  successfullyRegistered,
  f => f,
);

const selector = createStructuredSelector({
  signupSuccess,
  loading,
});

const actions = { onSubmit: signup, resetSuccessState };

const reduxConnect = connect(
  selector,
  actions,
);

const formConnect = reduxForm({
  form: 'signup',
});

export { SignupForm };

export default withRouter(
  compose(
    reduxConnect,
    formConnect,
  )(SignupForm),
);
