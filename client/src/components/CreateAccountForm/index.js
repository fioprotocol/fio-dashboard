import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { withLastLocation } from 'react-router-last-location';

import { compose } from '../../utils';
import { resetSuccessState, nonce } from '../../redux/profile/actions';
import { setAccount } from '../../redux/edge/actions';
import { showLoginModal } from '../../redux/modal/actions';
import {
  successfullyRegistered,
  loading as serverSignUpLoading,
} from '../../redux/profile/selectors';
import { signup } from '../../redux/profile/actions';
import { withRouter } from 'react-router-dom';
import CreateAccountForm from './CreateAccountForm';

const signupSuccess = createSelector(successfullyRegistered, f => f);

const selector = createStructuredSelector({
  serverSignUpLoading,
  signupSuccess,
});

const actions = {
  onSubmit: signup,
  resetSuccessState,
  showLoginModal,
  setAccount,
  nonce,
};

const reduxConnect = connect(selector, actions);

export { CreateAccountForm };

export default withLastLocation(
  withRouter(compose(reduxConnect)(CreateAccountForm)),
);
