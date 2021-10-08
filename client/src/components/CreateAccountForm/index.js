import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { withLastLocation } from 'react-router-last-location';

import { compose } from '../../utils';
import { resetSuccessState, nonce } from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { signup } from '../../redux/profile/actions';

import {
  successfullyRegistered,
  loading as serverSignUpLoading,
} from '../../redux/profile/selectors';
import { isRefFlow, refProfileInfo } from '../../redux/refProfile/selectors';

import { withRouter } from 'react-router-dom';
import CreateAccountForm from './CreateAccountForm';

const signupSuccess = createSelector(successfullyRegistered, f => f);

const selector = createStructuredSelector({
  serverSignUpLoading,
  isRefFlow,
  refProfileInfo,
  signupSuccess,
});

const actions = {
  onSubmit: signup,
  resetSuccessState,
  showLoginModal,
  nonce,
};

const reduxConnect = connect(selector, actions);

export { CreateAccountForm };

export default withLastLocation(
  withRouter(compose(reduxConnect)(CreateAccountForm)),
);
