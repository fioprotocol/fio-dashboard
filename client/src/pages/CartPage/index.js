import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cartItems, paymentWalletId } from '../../redux/cart/selectors';
import { deleteItem, recalculate, setWallet } from '../../redux/cart/actions';
import { refreshBalance } from '../../redux/fio/actions';

import { hasFreeAddress } from '../../redux/profile/selectors';
import { domains, prices } from '../../redux/registrations/selectors';
import {
  account,
  fioWallets,
  isAuthenticated,
} from '../../redux/edge/selectors';
import { fioWallets as userWallets } from '../../redux/fio/selectors';

import CartPage from './CartPage';

const reduxConnect = connect(
  createStructuredSelector({
    cartItems,
    domains,
    fioWallets,
    prices,
    account,
    userWallets,
    paymentWalletId,
    isAuthenticated,
    hasFreeAddress,
  }),
  {
    deleteItem,
    recalculate,
    setWallet,
    refreshBalance,
  },
);

export default withRouter(compose(reduxConnect)(CartPage));
