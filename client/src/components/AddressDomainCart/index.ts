import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { deleteItem } from '../../redux/cart/actions';
import { setRedirectPath } from '../../redux/navigation/actions';
import { showLoginModal } from '../../redux/modal/actions';

import { cartId, cartItems, loading } from '../../redux/cart/selectors';
import {
  hasFreeAddress,
  isAuthenticated,
  lastAuthData,
} from '../../redux/profile/selectors';
import { fioWallets } from '../../redux/fio/selectors';

import AddressDomainCart from './AddressDomainCart';

const reduxConnect = connect(
  createStructuredSelector({
    cartId,
    cartItems,
    hasFreeAddress,
    isAuthenticated,
    fioWallets,
    lastAuthData,
    loading,
  }),
  {
    deleteItem,
    setRedirectPath,
    showLoginModal,
  },
);

export default compose(reduxConnect)(AddressDomainCart);
