import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshBalance } from '../../redux/fio/actions';

import {
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  loading,
} from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';
import { fioWalletsData as fioWalletsDataSelector } from '../../redux/fioWalletsData/selectors';
import { user as userSelector } from '../../redux/profile/selectors';

import FioRequestDecryptPage from './FioRequestDecryptPage';

import { emptyWallet } from '../../redux/fio/reducer';
import { DEFAULT_BALANCES } from '../../util/prices';

import { ReduxState } from '../../redux/init';
import { ContainerOwnProps } from './types';
import { FioWalletDoublet } from '../../types';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallet: (state: ReduxState, ownProps: ContainerOwnProps | {}) => {
      const { fioWallets } = state.fio;
      if (!('match' in ownProps)) return emptyWallet;

      return fioWallets.find(
        ({ publicKey }: FioWalletDoublet) =>
          publicKey === ownProps.match.params.publicKey,
      );
    },
    loading,
    roe,
    balance: (state: ReduxState, ownProps: ContainerOwnProps | {}) => {
      const fioWallets = fioWalletsSelector(state);
      const fioWalletsBalances = fioWalletsBalancesSelector(state);
      if (!('match' in ownProps)) return DEFAULT_BALANCES;

      const fioWallet = fioWallets.find(
        ({ publicKey }: { publicKey: string }) =>
          publicKey === ownProps.match.params.publicKey,
      );

      if (!fioWallet || !fioWalletsBalances.wallets[fioWallet.publicKey])
        return DEFAULT_BALANCES;

      return fioWalletsBalances.wallets[fioWallet.publicKey];
    },
    fioWalletsData: (state: ReduxState) => {
      const fioWalletsData = fioWalletsDataSelector(state);
      const user = userSelector(state);

      return user?.id ? fioWalletsData[user.id] : null;
    },
  }),
  {
    refreshBalance,
  },
);

export default compose(reduxConnect)(FioRequestDecryptPage);
