import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import {
  resetSuccessState,
  makeNonce,
  signup,
  resetError,
} from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';
import {
  setPinEnabled,
  setPinSetupPostponed,
  toggleTwoFactorAuth,
} from '../../redux/edge/actions';
import { setRedirectPath } from '../../redux/navigation/actions';

import {
  successfullyRegistered,
  loading as serverSignUpLoading,
  error,
} from '../../redux/profile/selectors';
import { refProfileInfo } from '../../redux/refProfile/selectors';
import { redirectLink } from '../../redux/navigation/selectors';

import CreateAccountForm from './CreateAccountForm';

const signupSuccess = createSelector(successfullyRegistered, f => f);

const selector = createStructuredSelector({
  serverSignUpLoading,
  refProfileInfo,
  signupSuccess,
  redirectLink,
  error,
});

const actions = {
  onSubmit: signup,
  resetSuccessState,
  showLoginModal,
  makeNonce,
  setPinEnabled,
  setPinSetupPostponed,
  setRedirectPath,
  toggleTwoFactorAuth,
  resetError,
};

const reduxConnect = connect(selector, actions);

export default compose(reduxConnect)(CreateAccountForm);
