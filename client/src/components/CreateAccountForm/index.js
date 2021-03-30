import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { compose } from '../../utils';
import { resetSuccessState } from '../../redux/profile/actions';
import { successfullyRegistered } from '../../redux/profile/selectors';
import { signup } from '../../redux/edge/actions';
import { loading } from '../../redux/edge/selectors';
import { withRouter } from 'react-router-dom';
import CreateAccountForm from './CreateAccountForm';

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

export { CreateAccountForm };

export default withRouter(compose(reduxConnect)(CreateAccountForm));
