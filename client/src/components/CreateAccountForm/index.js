import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { withLastLocation } from 'react-router-last-location';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import {
  resetSuccessState,
  nonce,
  resetLastAuthData,
  signup,
} from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { clearCachedUser } from '../../redux/edge/actions';

import {
  successfullyRegistered,
  loading as serverSignUpLoading,
  lastAuthData,
} from '../../redux/profile/selectors';
import {
  isRefFlow,
  refProfileInfo,
  refProfileQueryParams,
} from '../../redux/refProfile/selectors';
import { redirectLink } from '../../redux/navigation/selectors';

import CreateAccountForm from './CreateAccountForm';

const signupSuccess = createSelector(successfullyRegistered, f => f);

const selector = createStructuredSelector({
  serverSignUpLoading,
  isRefFlow,
  refProfileInfo,
  refProfileQueryParams,
  signupSuccess,
  lastAuthData,
  redirectLink,
});

const actions = {
  onSubmit: signup,
  resetSuccessState,
  showLoginModal,
  nonce,
  resetLastAuthData,
  clearCachedUser,
};

const reduxConnect = connect(selector, actions);

export { CreateAccountForm };

export default withLastLocation(
  withRouter(compose(reduxConnect)(CreateAccountForm)),
);
