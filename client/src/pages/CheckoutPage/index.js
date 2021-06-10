import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { refreshBalance } from '../../redux/fio/actions';
import { fioWallets } from '../../redux/fio/selectors';
import { cartItems, paymentWalletId } from '../../redux/cart/selectors';
import { isAuthenticated } from '../../redux/edge/selectors';
import { setRegistration } from '../../redux/registrations/actions';
import { setWallet, recalculate } from '../../redux/cart/actions';

import { hasFreeAddress } from '../../redux/profile/selectors';
import { domains, prices } from '../../redux/registrations/selectors';

import CheckoutPage from './CheckoutPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    cartItems,
    paymentWalletId,
    isAuthenticated,
    prices,
    domains,
    hasFreeAddress,
  }),
  {
    refreshBalance,
    setRegistration,
    setWallet,
    recalculate,
  },
);

export default withRouter(compose(reduxConnect)(CheckoutPage));
