import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { deleteItem, recalculate } from '../../redux/cart/actions';
import { setRedirectPath } from '../../redux/navigation/actions';

import { cartItems } from '../../redux/cart/selectors';
import { hasFreeAddress, isAuthenticated } from '../../redux/profile/selectors';
import { domains, prices } from '../../redux/registrations/selectors';
import { fioWallets } from '../../redux/fio/selectors';

import AddressDomainCart from './AddressDomainCart';

const reduxConnect = connect(
  createStructuredSelector({
    cartItems,
    domains,
    prices,
    hasFreeAddress,
    isAuthenticated,
    fioWallets,
  }),
  {
    deleteItem,
    recalculate,
    setRedirectPath,
  },
);

export default withRouter(compose(reduxConnect)(AddressDomainCart));
