import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshBalance } from '../../redux/fio/actions';
import {
  fioWallets,
  fioWalletsBalances,
  loading,
} from '../../redux/fio/selectors';
import { noProfileLoaded } from '../../redux/profile/selectors';

import WalletsPage from './WalletsPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    loading,
    noProfileLoaded,
    balance: fioWalletsBalances,
  }),
  { refreshBalance },
);

export default compose(reduxConnect)(WalletsPage);
