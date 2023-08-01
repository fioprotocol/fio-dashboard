import { RouteComponentProps } from 'react-router-dom';
import { createSelector } from 'reselect';

import { prefix } from './actions';
import { emptyWallet } from './reducer';
import { getElementByFioName } from '../../utils';
import {
  FeePrice,
  FioAddressDoublet,
  FioDomainDoublet,
  FioNameItemProps,
  FioWalletDoublet,
  MappedPublicAddresses,
  NFTTokenDoublet,
  OwnPropsAny,
  PrivateDomainsMap,
  FioAddressWithPubAddresses,
  WalletsBalances,
} from '../../types';
import { ReduxState } from '../init';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const walletsFioAddressesLoading = (state: ReduxState): boolean =>
  state[prefix].walletsFioAddressesLoading;
export const linkProcessing = (state: ReduxState): boolean =>
  state[prefix].linkProcessing;
export const fioWallets = (state: ReduxState): FioWalletDoublet[] =>
  state[prefix].fioWallets;
export const fioWalletsIdKeys = (
  state: ReduxState,
): { id: string; publicKey: string }[] => state[prefix].fioWalletsIdKeys;
export const isFioWalletsBalanceLoading = (state: ReduxState): boolean =>
  state[prefix].isFioWalletsBalanceLoading;
export const fioAddressesLoading = (state: ReduxState): boolean =>
  state[prefix].fioAddressesLoading;
export const fioAddresses = (state: ReduxState): FioAddressDoublet[] =>
  state[prefix].fioAddresses;
export const fioDomains = (state: ReduxState): FioDomainDoublet[] =>
  state[prefix].fioDomains;
export const hasMoreAddresses = (
  state: ReduxState,
): { [publicKey: string]: number } => state[prefix].hasMoreAddresses;
export const hasMoreDomains = (
  state: ReduxState,
): { [publicKey: string]: number } => state[prefix].hasMoreDomains;
export const fees = (state: ReduxState): { [endpoint: string]: FeePrice } =>
  state[prefix].fees;
export const oracleFees = (
  state: ReduxState,
): { [endpoint: string]: FeePrice } => state[prefix].oracleFees;
export const fioWalletsBalances = (state: ReduxState): WalletsBalances =>
  state[prefix].fioWalletsBalances;
export const feesLoading = (
  state: ReduxState,
): { [endpoint: string]: boolean } => state[prefix].feesLoading;
export const oracleFeesLoading = (
  state: ReduxState,
): { [endpoint: string]: boolean } => state[prefix].oracleFeesLoading;
export const nftSignatures = (state: ReduxState): NFTTokenDoublet[] =>
  state[prefix].nftList;
export const mappedPublicAddresses = (
  state: ReduxState,
): MappedPublicAddresses => state[prefix].mappedPublicAddresses;
export const fioNamesInitRefreshed = (state: ReduxState): boolean =>
  state[prefix].fioNamesInitRefreshed;
export const showTokenListInfoBadge = (state: ReduxState): boolean =>
  state[prefix].showTokenListInfoBadge;
export const showSocialMediaListInfoBadge = (state: ReduxState): boolean =>
  state[prefix].showSocialMediaListInfoBadge;
export const showFchBundleWarningBagde = (state: ReduxState): boolean =>
  state[prefix].showFchBundleWarningBagde;
export const showExpiredDomainWarningBadge = (state: ReduxState): boolean =>
  state[prefix].showExpiredDomainWarningBadge;

export const currentWallet = (
  state: ReduxState,
  ownProps: {
    fioNameList: FioNameItemProps[];
    name: string;
  } & OwnPropsAny,
): FioWalletDoublet => {
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
    (state: ReduxState, fioCryptoHandle: string) => fioCryptoHandle,
  ],
  (
    fioWallets,
    fioAddresses,
    mappedPublicAddresses,
    fioCryptoHandle,
  ): FioAddressWithPubAddresses | null => {
    const currentAddress = getElementByFioName({
      fioNameList: (fioAddresses as unknown) as FioNameItemProps[],
      name: fioCryptoHandle,
    });

    if (!currentAddress) return null;

    const wallet: FioWalletDoublet =
      fioWallets &&
      fioWallets.find(
        (walletItem: FioWalletDoublet) =>
          walletItem.publicKey === currentAddress.walletPublicKey,
      );

    const { publicAddresses = [], more = false } = mappedPublicAddresses[
      fioCryptoHandle
    ]
      ? mappedPublicAddresses[fioCryptoHandle]
      : {};

    return {
      ...currentAddress,
      edgeWalletId: wallet && wallet.edgeId,
      publicAddresses,
      more,
    };
  },
);

export const walletPublicKey = (
  state: ReduxState,
  ownProps: {
    fioNameList: FioNameItemProps[];
    name: string;
  } & OwnPropsAny,
): string => {
  const { fioNameList, name } = ownProps;
  const selected = getElementByFioName({ fioNameList, name });

  return (selected && selected.walletPublicKey) || '';
};

export const selectedFioDomain = (
  state: ReduxState,
  ownProps: RouteComponentProps<{ id: string }> & OwnPropsAny,
): FioNameItemProps => {
  const { fioDomains: fioNameList } = state.fio;
  const {
    location: {
      query: { name },
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

export const privateDomains = createSelector(
  fioDomains,
  fioWallets,
  (fioDomains, wallets) => {
    return fioDomains
      .filter(({ isPublic }) => !isPublic)
      .reduce((acc: PrivateDomainsMap, domain) => {
        acc[domain.name] = {
          ...domain,
          wallet:
            wallets &&
            wallets.find(
              (walletItem: FioWalletDoublet) =>
                walletItem.publicKey === domain.walletPublicKey,
            ),
        };

        return acc;
      }, {});
  },
);

export const getMappedPubAddressError = (state: ReduxState): number | null =>
  state[prefix].getMappedPubAddressError;
