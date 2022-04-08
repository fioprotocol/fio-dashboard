import { RouteComponentProps } from 'react-router-dom';
import { createSelector } from 'reselect';

import { prefix } from './actions';
import { emptyWallet } from './reducer';
import { getElementByFioName } from '../../utils';
import { FioNameItemProps, FioWalletDoublet } from '../../types';
import { ReduxState } from '../init';

export const loading = (state: ReduxState) => state[prefix].loading;
export const walletsFioAddressesLoading = (state: ReduxState) =>
  state[prefix].walletsFioAddressesLoading;
export const linkProcessing = (state: ReduxState) =>
  state[prefix].linkProcessing;
export const fioWallets = (state: ReduxState) => state[prefix].fioWallets;
export const fioWalletsIdKeys = (state: ReduxState) =>
  state[prefix].fioWalletsIdKeys;
export const fioAddresses = (state: ReduxState) => state[prefix].fioAddresses;
export const fioDomains = (state: ReduxState) => state[prefix].fioDomains;
export const hasMoreAddresses = (state: ReduxState) =>
  state[prefix].hasMoreAddresses;
export const hasMoreDomains = (state: ReduxState) =>
  state[prefix].hasMoreDomains;
export const fees = (state: ReduxState) => state[prefix].fees;
export const fioWalletsBalances = (state: ReduxState) =>
  state[prefix].fioWalletsBalances;
export const feesLoading = (state: ReduxState) => state[prefix].feesLoading;
export const nftSignatures = (state: ReduxState) => state[prefix].nftList;
export const mappedPublicAddresses = (state: ReduxState) =>
  state[prefix].mappedPublicAddresses;
export const fioNamesInitRefreshed = (state: ReduxState) =>
  state[prefix].fioNamesInitRefreshed;

export const currentWallet = (
  state: ReduxState,
  ownProps: {
    fioNameList: FioNameItemProps[];
    name: string;
  } & any,
) => {
  const { fioWallets: wallets } = state.fio;
  const { fioNameList, name } = ownProps;

  const selected = getElementByFioName({ fioNameList, name });
  const selectedPublicKey = (selected && selected.walletPublicKey) || '';
  // FioWalletDoublet
  const wallet: FioWalletDoublet =
    wallets &&
    wallets.find(
      (walletItem: FioWalletDoublet) =>
        walletItem.publicKey === selectedPublicKey,
    );

  return wallet || emptyWallet;
};

export const currentFioAddress = createSelector(
  [
    fioWallets,
    fioAddresses,
    mappedPublicAddresses,
    (state: ReduxState, ownProps: any) => ownProps.match.params.id,
  ],
  // tslint:disable-next-line:no-shadowed-variable
  (fioWallets, fioAddresses, mappedPublicAddresses, id) => {
    const currentAddress = getElementByFioName({
      fioNameList: fioAddresses,
      name: id,
    });

    if (!currentAddress) return {};

    const wallet: FioWalletDoublet =
      fioWallets &&
      fioWallets.find(
        (walletItem: FioWalletDoublet) =>
          walletItem.publicKey === currentAddress.walletPublicKey,
      );

    const { publicAddresses = [], more = false } = mappedPublicAddresses[id]
      ? mappedPublicAddresses[id]
      : {};

    return {
      ...currentAddress,
      edgeWalletId: wallet && wallet.edgeId,
      publicAddresses,
      more,
    };
  },
);

export const showTokenListInfoBadge = (state: ReduxState) =>
  state[prefix].showTokenListInfoBadge;

export const walletPublicKey = (
  state: ReduxState,
  ownProps: {
    fioNameList: FioNameItemProps[];
    name: string;
  } & any,
) => {
  const { fioNameList, name } = ownProps;
  const selected = getElementByFioName({ fioNameList, name });

  return (selected && selected.walletPublicKey) || '';
};

export const selectedFioDomain = (
  state: ReduxState,
  ownProps: RouteComponentProps<{ id: string }> & any,
) => {
  const { fioDomains: fioNameList } = state.fio;
  const {
    match: {
      params: { id: name },
    },
  } = ownProps;

  return getElementByFioName({ fioNameList, name });
};

export const fioWalletForDomain = createSelector(
  selectedFioDomain,
  fioWallets,
  (fioDomain, wallets) => {
    const wallet: FioWalletDoublet =
      wallets &&
      wallets.find(
        (walletItem: FioWalletDoublet) =>
          walletItem.publicKey === fioDomain.walletPublicKey,
      );

    return wallet || emptyWallet;
  },
);
