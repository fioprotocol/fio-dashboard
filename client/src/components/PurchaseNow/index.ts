import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { checkCaptcha, setProcessing } from '../../redux/registrations/actions';

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
  captchaResolving,
  fioWallets,
  prices,
  isProcessing,
  refProfileInfo,
  user,
});

const actions = {
  checkCaptcha,
  setProcessing,
};

const reduxConnect = connect(selector, actions);

export default compose(reduxConnect)(PurchaseNow);
