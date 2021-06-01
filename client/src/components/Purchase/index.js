import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '../../utils';

import { recalculate, setWallet } from '../../redux/cart/actions';
import { refreshBalance } from '../../redux/fio/actions';
import { setRegistration, getPrices } from '../../redux/registrations/actions';

import {
  registrationResult,
  prices,
  domains,
} from '../../redux/registrations/selectors';

import { fioWallets } from '../../redux/fio/selectors';

import Purchase from './Purchase';

const reduxConnect = connect(
  createStructuredSelector({
    registrationResult,
    fioWallets,
    prices,
    domains,
  }),
  {
    recalculate,
    refreshBalance,
    setWallet,
    setRegistration,
    getPrices,
  },
);

export default compose(reduxConnect)(Purchase);
