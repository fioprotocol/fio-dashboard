import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshBalance } from '../../redux/fio/actions';
import { setConfirmPinKeys } from '../../redux/edge/actions';
import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';

import { loading, fioWallets } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';
import { fioWalletsData as fioWalletsDataSelector } from '../../redux/fioWalletsData/selectors';
import { user as userSelector } from '../../redux/profile/selectors';

import FioRequestDecryptPage from './FioRequestDecryptPage';

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    loading,
    roe,
    fioWalletsData: (state: ReduxState) => {
      const fioWalletsData = fioWalletsDataSelector(state);
      const user = userSelector(state);

      return user?.id ? fioWalletsData[user.id] : null;
    },
  }),
  {
    refreshBalance,
    refreshWalletDataPublicKey,
    setConfirmPinKeys,
  },
);

export default compose(reduxConnect)(FioRequestDecryptPage);
