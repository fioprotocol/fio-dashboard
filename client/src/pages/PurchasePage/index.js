import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { recalculate } from '../../redux/cart/actions';

import {
  registrationResult,
  prices,
  domains,
} from '../../redux/registrations/selectors';
import { isAuthenticated } from '../../redux/edge/selectors';
import { cartItems } from '../../redux/cart/selectors';

import PurchasePage from './PurchasePage';

const reduxConnect = connect(
  createStructuredSelector({
    registrationResult,
    isAuthenticated,
    cartItems,
    prices,
    domains,
  }),
  {
    recalculate,
  },
);

export default withRouter(compose(reduxConnect)(PurchasePage));
