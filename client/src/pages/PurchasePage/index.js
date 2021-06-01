import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cartItems } from '../../redux/cart/selectors';
import { registrationResult } from '../../redux/registrations/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';

import PurchasePage from './PurchasePage';

const reduxConnect = connect(
  createStructuredSelector({
    cartItems,
    registrationResult,
    isAuthenticated,
  }),
);

export default withRouter(compose(reduxConnect)(PurchasePage));
