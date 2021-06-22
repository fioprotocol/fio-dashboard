import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { refreshBalance } from '../../redux/fio/actions';
import { fioWallets, loading } from '../../redux/fio/selectors';
import { cartItems, paymentWalletId } from '../../redux/cart/selectors';
import { setRegistration } from '../../redux/registrations/actions';
import { setWallet, recalculate } from '../../redux/cart/actions';

import { isAuthenticated, hasFreeAddress } from '../../redux/profile/selectors';
import {
  domains,
  prices,
  isProcessing,
} from '../../redux/registrations/selectors';

import CheckoutPage from './CheckoutPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    fioWallets,
    cartItems,
    paymentWalletId,
    isAuthenticated,
    prices,
    domains,
    hasFreeAddress,
    isProcessing,
  }),
  {
    refreshBalance,
    setRegistration,
    setWallet,
    recalculate,
  },
);

export default withRouter(compose(reduxConnect)(CheckoutPage));
