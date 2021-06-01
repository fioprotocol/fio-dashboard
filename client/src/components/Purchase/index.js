import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '../../utils';

import { recalculate, setWallet } from '../../redux/cart/actions';
import { refreshBalance } from '../../redux/fio/actions';
import { setRegistration } from '../../redux/registrations/actions';

import { registrationResult } from '../../redux/registrations/selectors';

import { fioWallets } from '../../redux/fio/selectors';

import Purchase from './Purchase';

const reduxConnect = connect(
  createStructuredSelector({
    registrationResult,
    fioWallets,
  }),
  {
    recalculate,
    refreshBalance,
    setWallet,
    setRegistration,
  },
);

export default compose(reduxConnect)(Purchase);
