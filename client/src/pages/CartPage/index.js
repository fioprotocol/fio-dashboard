import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cart } from '../../redux/cart/selectors';
import { deleteItem, recalculate } from '../../redux/cart/actions';
import { domains, prices } from '../../redux/registrations/selectors';
import { account, fioWallets } from '../../redux/edge/selectors';

import CartPage from './CartPage';

const reduxConnect = connect(
  createStructuredSelector({ cart, domains, fioWallets, prices, account }),
  {
    deleteItem,
    recalculate,
  },
);

export default withRouter(compose(reduxConnect)(CartPage));
