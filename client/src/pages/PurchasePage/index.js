import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cartItems } from '../../redux/cart/selectors';
import PurchasePage from './PurchasePage';

const reduxConnect = connect(
  createStructuredSelector({
    cartItems,
  }),
);

export default withRouter(compose(reduxConnect)(PurchasePage));
