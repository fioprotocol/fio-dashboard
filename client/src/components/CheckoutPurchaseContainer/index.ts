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

import { fioActionExecuted } from '../../redux/fio/actions';

import CheckoutPurchaseContainer from './CheckoutPurchaseContainer';

const reduxConnect = connect(
  createStructuredSelector({
    registrationResult,
    isProcessing,
  }),
  {
    setRegistration,
    setProcessing,
    fioActionExecuted,
  },
);

export default compose(reduxConnect)(CheckoutPurchaseContainer);
