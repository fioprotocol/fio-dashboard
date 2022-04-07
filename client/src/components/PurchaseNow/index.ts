import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { showPinModal } from '../../redux/modal/actions';
import { checkCaptcha, setProcessing } from '../../redux/registrations/actions';
import { loadProfile } from '../../redux/profile/actions';
import { resetPinConfirm } from '../../redux/edge/actions';
import { confirmingPin, pinConfirmation } from '../../redux/edge/selectors';
import { cartItems, paymentWalletPublicKey } from '../../redux/cart/selectors';
import {
  captchaResult,
  captchaResolving,
  prices,
  isProcessing,
} from '../../redux/registrations/selectors';
import { fioWallets } from '../../redux/fio/selectors';
import { user } from '../../redux/profile/selectors';
import { refProfileInfo } from '../../redux/refProfile/selectors';

import { PurchaseNow } from './PurchaseNow';

const selector = createStructuredSelector({
  cartItems,
  paymentWalletPublicKey,
  captchaResult,
  pinConfirmation,
  confirmingPin,
  captchaResolving,
  fioWallets,
  prices,
  isProcessing,
  refProfileInfo,
  user,
});

const actions = {
  loadProfile,
  showPinModal,
  checkCaptcha,
  resetPinConfirm,
  setProcessing,
};

const reduxConnect = connect(selector, actions);

export default compose(reduxConnect)(PurchaseNow);
