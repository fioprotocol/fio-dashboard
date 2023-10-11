import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshBalance } from '../../redux/fio/actions';
import { setConfirmPinKeys } from '../../redux/edge/actions';
import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';

import { loading, fioWallets } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import FioRequestDecryptPage from './FioRequestDecryptPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    loading,
    roe,
  }),
  {
    refreshBalance,
    refreshWalletDataPublicKey,
    setConfirmPinKeys,
  },
);

export default compose(reduxConnect)(FioRequestDecryptPage);
