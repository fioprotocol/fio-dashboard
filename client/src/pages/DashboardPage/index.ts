import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioAddresses } from '../../redux/fio/actions';
import { user } from '../../redux/profile/selectors';
import { fioWallets, fioAddresses, loading } from '../../redux/fio/selectors';

import DashboardPage from './DashboardPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    user,
    fioAddresses,
    loading,
  }),
  { getFioAddresses },
);

export default compose(reduxConnect)(DashboardPage);
