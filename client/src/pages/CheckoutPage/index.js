import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { refreshBalance } from '../../redux/fio/actions';
import { fioWallets } from '../../redux/fio/selectors';
import CheckoutPage from './CheckoutPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
  }),
  {
    refreshBalance,
  },
);

export default withRouter(compose(reduxConnect)(CheckoutPage));
