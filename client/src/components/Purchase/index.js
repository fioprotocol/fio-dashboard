import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '../../utils';

import { recalculate } from '../../redux/cart/actions';
import { registrationResult } from '../../redux/registrations/selectors';

import Purchase from './Purchase';

const reduxConnect = connect(
  createStructuredSelector({
    registrationResult,
  }),
  {
    recalculate,
  },
);

export default compose(reduxConnect)(Purchase);
