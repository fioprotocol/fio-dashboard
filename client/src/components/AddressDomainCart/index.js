import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cartItems } from '../../redux/cart/selectors';
import { account, isAuthenticated } from '../../redux/edge/selectors';
import { deleteItem, recalculate } from '../../redux/cart/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { domains, prices } from '../../redux/registrations/selectors';
import { hasFreeAddress } from '../../redux/profile/selectors';

import AddressDomainCart from './AddressDomainCart';

const reduxConnect = connect(
  createStructuredSelector({
    cartItems,
    account,
    domains,
    prices,
    hasFreeAddress,
    isAuthenticated,
  }),
  {
    deleteItem,
    showLoginModal,
    recalculate,
  },
);

export default withRouter(compose(reduxConnect)(AddressDomainCart));
