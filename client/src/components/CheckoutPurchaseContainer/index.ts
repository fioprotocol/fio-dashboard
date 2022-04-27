import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import {
  setRegistration,
  setProcessing,
} from '../../redux/registrations/actions';

import {
  registrationResult,
  isProcessing,
} from '../../redux/registrations/selectors';

import CheckoutPurchaseContainer from './CheckoutPurchaseContainer';

const reduxConnect = connect(
  createStructuredSelector({
    registrationResult,
    isProcessing,
  }),
  {
    setRegistration,
    setProcessing,
  },
);

export default compose(reduxConnect)(CheckoutPurchaseContainer);
