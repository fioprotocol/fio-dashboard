import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { compose } from '../../utils';
import { resetSuccessState } from '../../redux/profile/actions';
import { successfullyRegistered } from '../../redux/profile/selectors';
import { signup, usernameAvailable } from '../../redux/edge/actions';
import { usernameAvailableLoading, usernameIsAvailable, loading } from '../../redux/edge/selectors';
import { withRouter } from 'react-router-dom';
import CreateAccountForm from './CreateAccountForm';

const signupSuccess = createSelector(
  successfullyRegistered,
  f => f,
);

const selector = createStructuredSelector({
  signupSuccess,
  usernameIsAvailable,
  usernameAvailableLoading,
  loading,
});

const actions = { onSubmit: signup, resetSuccessState, usernameAvailable };

const reduxConnect = connect(
  selector,
  actions,
);

export { CreateAccountForm };

export default withRouter(compose(reduxConnect)(CreateAccountForm));
