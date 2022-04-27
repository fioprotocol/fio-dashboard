import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { withLastLocation } from 'react-router-last-location';

import { compose } from '../../utils';
import {
  resetSuccessState,
  makeNonce,
  signup,
} from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';

import {
  successfullyRegistered,
  loading as serverSignUpLoading,
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
  redirectLink,
});

const actions = {
  onSubmit: signup,
  resetSuccessState,
  showLoginModal,
  makeNonce,
};

const reduxConnect = connect(selector, actions);

export default withLastLocation(compose(reduxConnect)(CreateAccountForm));
