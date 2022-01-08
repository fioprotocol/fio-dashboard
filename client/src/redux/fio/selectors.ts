import { RouteComponentProps } from 'react-router-dom';
import { createSelector } from 'reselect';
import { prefix } from './actions';
import { emptyWallet } from './reducer';
import { getElementByFioName } from '../../utils';
import { FioNameItemProps, FioWalletDoublet } from '../../types';
import { ReduxState } from '../../redux/init';

export const loading = (state: ReduxState) => state[prefix].loading;
export const linkProcessing = (state: ReduxState) =>
  state[prefix].linkProcessing;
export const fioWallets = (state: ReduxState) => state[prefix].fioWallets;
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

export const currentWallet = (
  state: ReduxState,
  ownProps: {
    fioNameList: FioNameItemProps[];
    name: string;
  } & any,
) => {
  const { fioWallets } = state.fio;
  const { fioNameList, name } = ownProps;

  const selected = getElementByFioName({ fioNameList, name });
  const walletPublicKey = (selected && selected.walletPublicKey) || '';
  // FioWalletDoublet
  const currentWallet: FioWalletDoublet =
    fioWallets &&
    fioWallets.find(
      (wallet: FioWalletDoublet) => wallet.publicKey === walletPublicKey,
    );

  return currentWallet || emptyWallet;
};

export const currentFioAddress = createSelector(
  [
    fioWallets,
    fioAddresses,
    mappedPublicAddresses,
    (state: ReduxState, ownProps: any) => ownProps.match.params.id,
  ],
  (fioWallets, fioAddresses, mappedPublicAddresses, id) => {
    const currentAddress = getElementByFioName({
      fioNameList: fioAddresses,
      name: id,
    });

    if (!currentAddress) return {};

    const currentWallet: FioWalletDoublet =
      fioWallets &&
      fioWallets.find(
        (wallet: FioWalletDoublet) =>
          wallet.publicKey === currentAddress.walletPublicKey,
      );

    const { publicAddresses = [], more = false } = mappedPublicAddresses[id]
      ? mappedPublicAddresses[id]
      : {};

    return {
      ...currentAddress,
      edgeWalletId: currentWallet && currentWallet.edgeId,
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
  const { fioDomains } = state.fio;
  const {
    match: {
      params: { id: name },
    },
  } = ownProps;

  return getElementByFioName({ fioNameList: fioDomains, name });
};

export const fioWalletForDomain = createSelector(
  selectedFioDomain,
  fioWallets,
  (fioDomain, fioWallets) => {
    const currentWallet: FioWalletDoublet =
      fioWallets &&
      fioWallets.find(
        (wallet: FioWalletDoublet) =>
          wallet.publicKey === fioDomain.walletPublicKey,
      );

    return currentWallet || emptyWallet;
  },
);
