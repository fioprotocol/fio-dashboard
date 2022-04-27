import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { recalculate } from '../../redux/cart/actions';

import {
  registrationResult,
  prices,
  domains,
  roe,
} from '../../redux/registrations/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';
import { cartItems } from '../../redux/cart/selectors';
import {
  isRefFlow,
  refProfileInfo,
  refProfileQueryParams,
} from '../../redux/refProfile/selectors';

import PurchasePage from './PurchasePage';

const reduxConnect = connect(
  createStructuredSelector({
    registrationResult,
    isAuthenticated,
    cartItems,
    prices,
    domains,
    isRefFlow,
    refProfileInfo,
    refProfileQueryParams,
    roe,
  }),
  {
    recalculate,
  },
);

export default compose(reduxConnect)(PurchasePage);
