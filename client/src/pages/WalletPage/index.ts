import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshBalance } from '../../redux/fio/actions';
import {
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  loading,
} from '../../redux/fio/selectors';
import { profileRefreshed } from '../../redux/profile/selectors';

import WalletPage from './WalletPage';
import { ReduxState } from '../../redux/init';

import { emptyWallet } from '../../redux/fio/reducer';
import { DEFAULT_BALANCES } from '../../util/prices';

import {
  fioWalletsData as fioWalletsDataSelector,
  fioWalletsTxHistory as fioWalletsTxHistorySelector,
} from '../../redux/fioWalletsData/selectors';
import { user as userSelector } from '../../redux/profile/selectors';

import { ContainerOwnProps } from './types';
import { OwnPropsAny } from '../../types';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallet: (
      state: ReduxState,
      ownProps: ContainerOwnProps & OwnPropsAny,
    ) => {
      const fioWallets = fioWalletsSelector(state);
      if (!('match' in ownProps)) return emptyWallet;

      return fioWallets.find(
        ({ publicKey }: { publicKey: string }) =>
          publicKey === ownProps.match.params.publicKey,
      );
    },
    loading,
    profileRefreshed,
    fioWalletsData: (state: ReduxState) => {
      const fioWalletsData = fioWalletsDataSelector(state);
      const user = userSelector(state);

      return user?.id ? fioWalletsData[user.id] : null;
    },
    fioWalletsTxHistory: (state: ReduxState) => {
      const fioWalletsTxHistory = fioWalletsTxHistorySelector(state);
      const user = userSelector(state);

      return user?.id && fioWalletsTxHistory[user.id]
        ? fioWalletsTxHistory[user.id]
        : {};
    },
    balance: (state: ReduxState, ownProps: ContainerOwnProps & OwnPropsAny) => {
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
  }),
  { refreshBalance },
);

export default compose(reduxConnect)(WalletPage);
