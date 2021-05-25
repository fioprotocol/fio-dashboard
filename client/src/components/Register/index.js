import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { showPinModal } from '../../redux/modal/actions';
import { checkCaptcha } from '../../redux/registrations/actions';
import { recordFreeAddress } from '../../redux/profile/actions';
import { successfullyRegistered } from '../../redux/profile/selectors';
import { loading as edgeLoading } from '../../redux/edge/selectors';
import { cartItems, paymentWallet } from '../../redux/cart/selectors';
import { pinConfirmation } from '../../redux/edge/selectors';
import { captchaResult } from '../../redux/registrations/selectors';
import { Register } from './Register';

const registerSuccess = createSelector(successfullyRegistered, f => f);

const selector = createStructuredSelector({
  cartItems,
  paymentWallet,
  captchaResult,
  pinConfirmation,
  registerSuccess,
  edgeLoading,
  recordFreeAddress,
});

const actions = {
  showPinModal,
  checkCaptcha,
};

const reduxConnect = connect(selector, actions);

export default compose(reduxConnect)(Register);
