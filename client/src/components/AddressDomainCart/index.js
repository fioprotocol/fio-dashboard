import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cart } from '../../redux/cart/selectors';
import { account, fioWallets } from '../../redux/edge/selectors';
import { deleteItem, recalculate } from '../../redux/cart/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { domains, prices } from '../../redux/registrations/selectors';

import AddressDomainCart from './AddressDomainCart';

const reduxConnect = connect(
  createStructuredSelector({
    cart,
    account,
    domains,
    fioWallets,
    prices,
  }),
  {
    deleteItem,
    showLoginModal,
    recalculate,
  },
);

export default withRouter(compose(reduxConnect)(AddressDomainCart));
