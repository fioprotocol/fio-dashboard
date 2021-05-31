import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { showPinModal } from '../../redux/modal/actions';
import {
  checkCaptcha,
  setRegistration,
} from '../../redux/registrations/actions';
import { recordFreeAddress } from '../../redux/profile/actions';
import { confirmingPin } from '../../redux/edge/selectors';
import { cartItems, paymentWallet } from '../../redux/cart/selectors';
import { pinConfirmation } from '../../redux/edge/selectors';
import {
  captchaResult,
  captchaResolving,
} from '../../redux/registrations/selectors';
import { fioWallets } from '../../redux/fio/selectors';

import { PurchaseNow } from './PurchaseNow';

const selector = createStructuredSelector({
  cartItems,
  paymentWallet,
  captchaResult,
  pinConfirmation,
  confirmingPin,
  captchaResolving,
  fioWallets,
});

const actions = {
  recordFreeAddress,
  showPinModal,
  checkCaptcha,
  setRegistration,
};

const reduxConnect = connect(selector, actions);

export default compose(reduxConnect)(PurchaseNow);
