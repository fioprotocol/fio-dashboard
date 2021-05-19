import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cart } from '../../redux/cart/selectors';
import { account } from '../../redux/edge/selectors';
import { deleteItem } from '../../redux/cart/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { domains } from '../../redux/registrations/selectors';

import AddressDomainCart from './AddressDomainCart';

const reduxConnect = connect(
  createStructuredSelector({
    cart,
    account,
    domains,
  }),
  {
    deleteItem,
    showLoginModal,
  },
);

export default withRouter(compose(reduxConnect)(AddressDomainCart));
