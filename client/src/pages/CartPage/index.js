import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cart } from '../../redux/cart/selectors';
import { deleteItem, recalculate } from '../../redux/cart/actions';
import { domains, prices } from '../../redux/registrations/selectors';
import { account, fioWallets } from '../../redux/edge/selectors';

import CartPage from './CartPage';

const wallets = () => [
  {
    name: 'testName',
    balance: 5000,
    publicAddress: 'testaddress1',
  },
  {
    name: 'testNameSecond',
    balance: 15000,
    publicAddress: 'test2address',
  },
]; //todo: change to real data

const reduxConnect = connect(
  createStructuredSelector({
    cart,
    domains,
    fioWallets,
    prices,
    account,
    wallets,
  }),
  {
    deleteItem,
    recalculate,
  },
);

export default withRouter(compose(reduxConnect)(CartPage));
