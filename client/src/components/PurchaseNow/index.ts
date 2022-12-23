import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { checkCaptcha, setProcessing } from '../../redux/registrations/actions';
import { loadProfile } from '../../redux/profile/actions';

import { confirmingPin } from '../../redux/edge/selectors';
import { cartItems, paymentWalletPublicKey } from '../../redux/cart/selectors';
import {
  captchaResult,
  captchaResolving,
  prices,
  isProcessing,
} from '../../redux/registrations/selectors';
import { fioWallets } from '../../redux/fio/selectors';
import { hasFreeAddress } from '../../redux/profile/selectors';
import { refProfileInfo } from '../../redux/refProfile/selectors';

import { PurchaseNow } from './PurchaseNow';

const selector = createStructuredSelector({
  cartItems,
  paymentWalletPublicKey,
  captchaResult,
  confirmingPin,
  captchaResolving,
  fioWallets,
  prices,
  isProcessing,
  refProfileInfo,
  hasFreeAddress,
});

const actions = {
  loadProfile,
  checkCaptcha,
  setProcessing,
};

const reduxConnect = connect(selector, actions);

export default compose(reduxConnect)(PurchaseNow);
