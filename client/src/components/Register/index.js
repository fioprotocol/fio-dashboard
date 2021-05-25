import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { showPinModal } from '../../redux/modal/actions';
import { checkCaptcha } from '../../redux/registrations/actions';
import { recordFreeAddress } from '../../redux/profile/actions';
import { confirmingPin } from '../../redux/edge/selectors';
import { cartItems, paymentWallet } from '../../redux/cart/selectors';
import { pinConfirmation } from '../../redux/edge/selectors';
import {
  captchaResult,
  captchaResolving,
} from '../../redux/registrations/selectors';
import { Register } from './Register';

const selector = createStructuredSelector({
  cartItems,
  paymentWallet,
  captchaResult,
  pinConfirmation,
  confirmingPin,
  captchaResolving,
});

const actions = {
  recordFreeAddress,
  showPinModal,
  checkCaptcha,
};

const reduxConnect = connect(selector, actions);

export default compose(reduxConnect)(Register);
