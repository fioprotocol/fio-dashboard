import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cartItems, paymentWalletID } from '../../redux/cart/selectors';
import { deleteItem, recalculate, setWallet } from '../../redux/cart/actions';
import { refreshBalance } from '../../redux/fio/actions';

import { domains, prices } from '../../redux/registrations/selectors';
import { account, fioWallets } from '../../redux/edge/selectors';
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
    paymentWalletID,
  }),
  {
    deleteItem,
    recalculate,
    setWallet,
    refreshBalance,
  },
);

export default withRouter(compose(reduxConnect)(CartPage));
