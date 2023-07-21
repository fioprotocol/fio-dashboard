import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  getAllFioPubAddresses,
  refreshBalance,
  refreshFioNames,
} from '../../redux/fio/actions';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioDomains as fioDomainsSelector,
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  isFioWalletsBalanceLoading as isFioWalletsBalanceLoadingSelector,
  loading as fioLoadingSelector,
  mappedPublicAddresses as mappedPublicAddressesSelector,
  walletsFioAddressesLoading as walletsFioAddressesLoadingSelector,
} from '../../redux/fio/selectors';

import { loading as edgeLoadingSelector } from '../../redux/edge/selectors';

import useEffectOnce from '../../hooks/general';
import { useCheckIfDesktop } from '../../screenType';

import { WalletBalancesItem } from '../../types';

type UseContextProps = {
  firstFromListFioAddressName: string;
  hasFCH: boolean;
  hasOneFCH: boolean;
  hasDomains: boolean;
  isDesktop: boolean;
  isFioWalletsBalanceLoading: boolean;
  loading: boolean;
  noMappedPubAddresses: boolean;
  totalBalance: WalletBalancesItem;
  totalBalanceLoading: boolean;
};

export const useContext = (): UseContextProps => {
  const fioWallets = useSelector(fioWalletsSelector);
  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const fioLoading = useSelector(fioLoadingSelector);
  const fioAddresses = useSelector(fioAddressesSelector);
  const fioDomains = useSelector(fioDomainsSelector);
  const mappedPublicAddresses = useSelector(mappedPublicAddressesSelector);
  const edgeLoading = useSelector(edgeLoadingSelector);
  const fioAddressesLoading = useSelector(fioAddressesLoadingSelector);
  const walletsFioAddressesLoading = useSelector(
    walletsFioAddressesLoadingSelector,
  );
  const isFioWalletsBalanceLoading = useSelector(
    isFioWalletsBalanceLoadingSelector,
  );

  const dispatch = useDispatch();

  const loading =
    fioLoading ||
    edgeLoading ||
    fioAddressesLoading ||
    walletsFioAddressesLoading;
  const hasFCH = fioAddresses?.length > 0;
  const hasOneFCH = fioAddresses?.length === 1;

  const hasDomains = fioDomains?.length > 0;

  const totalBalance = fioWalletsBalances?.total?.total;

  const noMappedPubAddresses =
    !isEmpty(mappedPublicAddresses) &&
    Object.values(mappedPublicAddresses).every(
      mappedPubicAddress => mappedPubicAddress.publicAddresses.length === 0,
    );

  const firstFromListFioAddressName = fioAddresses[0]?.name;

  const isDesktop = useCheckIfDesktop();

  useEffectOnce(
    () => {
      for (const { publicKey } of fioWallets) {
        dispatch(refreshBalance(publicKey));
        dispatch(refreshFioNames(publicKey));
      }
    },
    [fioWallets, dispatch],
    fioWallets.length > 0,
  );

  useEffectOnce(
    () => {
      for (const fioAddress of fioAddresses) {
        dispatch(getAllFioPubAddresses(fioAddress.name, 0, 0));
      }
    },
    [dispatch, fioAddresses],
    fioAddresses.length > 0,
  );

  return {
    firstFromListFioAddressName,
    hasFCH,
    hasOneFCH,
    hasDomains,
    isDesktop,
    isFioWalletsBalanceLoading,
    loading,
    noMappedPubAddresses,
    totalBalance,
    totalBalanceLoading: isFioWalletsBalanceLoading,
  };
};
