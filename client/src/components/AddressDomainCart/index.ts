import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { deleteItem, setCartItems } from '../../redux/cart/actions';
import { setRedirectPath } from '../../redux/navigation/actions';
import { showLoginModal } from '../../redux/modal/actions';

import { cartId, cartItems } from '../../redux/cart/selectors';
import {
  hasFreeAddress,
  isAuthenticated,
  lastAuthData,
} from '../../redux/profile/selectors';
import { domains, prices, roe } from '../../redux/registrations/selectors';
import { fioWallets } from '../../redux/fio/selectors';

import AddressDomainCart from './AddressDomainCart';

const reduxConnect = connect(
  createStructuredSelector({
    cartId,
    cartItems,
    domains,
    prices,
    hasFreeAddress,
    isAuthenticated,
    fioWallets,
    roe,
    lastAuthData,
  }),
  {
    deleteItem,
    setCartItems,
    setRedirectPath,
    showLoginModal,
  },
);

export default compose(reduxConnect)(AddressDomainCart);
