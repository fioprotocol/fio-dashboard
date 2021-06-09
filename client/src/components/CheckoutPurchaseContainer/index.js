import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { setRegistration } from '../../redux/registrations/actions';

import { registrationResult } from '../../redux/registrations/selectors';

import CheckoutPurchaseContainer from './CheckoutPurchaseContainer';

const reduxConnect = connect(
  createStructuredSelector({
    registrationResult,
  }),
  {
    setRegistration,
  },
);

export default withRouter(compose(reduxConnect)(CheckoutPurchaseContainer));
