import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { refreshBalance } from '../../redux/fio/actions';
import { fioWallets } from '../../redux/fio/selectors';
import { cartItems, paymentWalletId } from '../../redux/cart/selectors';
import { isAuthenticated } from '../../redux/edge/selectors';
import { setRegistration, getPrices } from '../../redux/registrations/actions';
import { setWallet } from '../../redux/cart/actions';

import CheckoutPage from './CheckoutPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    cartItems,
    paymentWalletId,
    isAuthenticated,
  }),
  {
    refreshBalance,
    setRegistration,
    getPrices,
    setWallet,
  },
);

export default withRouter(compose(reduxConnect)(CheckoutPage));
