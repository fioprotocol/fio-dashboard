import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { showPinModal } from '../../redux/modal/actions';
import { checkCaptcha } from '../../redux/registrations/actions';
import { loadProfile } from '../../redux/profile/actions';
import { confirmingPin, pinConfirmation } from '../../redux/edge/selectors';
import { cartItems, paymentWalletId } from '../../redux/cart/selectors';
import {
  captchaResult,
  captchaResolving,
  prices,
} from '../../redux/registrations/selectors';
import { fioWallets } from '../../redux/fio/selectors';

import { PurchaseNow } from './PurchaseNow';

const selector = createStructuredSelector({
  cartItems,
  paymentWalletId,
  captchaResult,
  pinConfirmation,
  confirmingPin,
  captchaResolving,
  fioWallets,
  prices,
});

const actions = {
  loadProfile,
  showPinModal,
  checkCaptcha,
};

const reduxConnect = connect(selector, actions);

export default compose(reduxConnect)(PurchaseNow);
