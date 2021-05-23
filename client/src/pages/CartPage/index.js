import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cartItems, paymentWallet } from '../../redux/cart/selectors';
import { deleteItem, recalculate, setWallet } from '../../redux/cart/actions';
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
    paymentWallet,
  }),
  {
    deleteItem,
    recalculate,
    setWallet,
  },
);

export default withRouter(compose(reduxConnect)(CartPage));
