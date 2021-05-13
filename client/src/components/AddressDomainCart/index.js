import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { cart } from '../../redux/cart/selectors';
import { deleteItem } from '../../redux/cart/actions';

import AddressDomainCart from './AddressDomainCart';

const reduxConnect = connect(createStructuredSelector({ cart }), {
  deleteItem,
});

export default compose(reduxConnect)(AddressDomainCart);
