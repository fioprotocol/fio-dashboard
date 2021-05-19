import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cart } from '../../redux/cart/selectors';
import { deleteItem } from '../../redux/cart/actions';
import { domains } from '../../redux/registrations/selectors';

import CartPage from './CartPage';

const reduxConnect = connect(createStructuredSelector({ cart, domains }), {
  deleteItem,
});

export default withRouter(compose(reduxConnect)(CartPage));
