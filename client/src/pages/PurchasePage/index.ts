import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { recalculate } from '../../redux/cart/actions';
import { onPurchaseResultsClose } from '../../redux/registrations/actions';

import {
  registrationResult,
  prices,
  domains,
  roe,
} from '../../redux/registrations/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';
import { cartItems } from '../../redux/cart/selectors';
import { containedFlowQueryParams } from '../../redux/containedFlow/selectors';

import PurchasePage from './PurchasePage';

const reduxConnect = connect(
  createStructuredSelector({
    registrationResult,
    isAuthenticated,
    cartItems,
    prices,
    domains,
    containedFlowQueryParams,
    roe,
  }),
  {
    recalculate,
    onPurchaseResultsClose,
  },
);

export default compose(reduxConnect)(PurchasePage);
