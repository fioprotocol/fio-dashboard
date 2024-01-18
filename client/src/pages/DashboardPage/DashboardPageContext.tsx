import { useCheckIfDesktop } from '../../screenType';

import { WalletBalancesItem } from '../../types';
import { useGetAllFioNamesAndWallets } from '../../hooks/fio';

type UseContextProps = {
  fio101ComponentProps: {
    firstFromListFioAddressName: string;
    hasFCH: boolean;
    hasOneFCH: boolean;
    hasDomains: boolean;
    isDesktop: boolean;
    loading: boolean;
    noMappedPubAddresses: boolean;
  };
  isDesktop: boolean;
  totalBalance: WalletBalancesItem;
  totalBalanceLoading: boolean;
  welcomeComponentProps: {
    firstFromListFioAddressName: string;
    firstFromListFioDomainName: string;
    firstFromListFioWalletPublicKey: string;
    hasAffiliate: boolean;
    hasDomains: boolean;
    hasExpiredDomains: boolean;
    hasFCH: boolean;
    hasNoStakedTokens: boolean;
    hasOneDomain: boolean;
    hasOneFCH: boolean;
    hasNoEmail: boolean;
    hasZeroTotalBalance: boolean;
    loading: boolean;
    noMappedPubAddresses: boolean;
    withoutMarginTop: boolean;
    userType: string;
  };
};

export const useContext = (): UseContextProps => {
  const allFioNamesAndWallets = useGetAllFioNamesAndWallets();
  const {
    firstFromListFioAddressName,
    fioWalletsBalances,
    isFioWalletsBalanceLoading,
    hasFCH,
    hasOneFCH,
    hasDomains,
    loading,
    noMappedPubAddresses,
  } = allFioNamesAndWallets;

  const totalBalance = fioWalletsBalances?.total?.total;

  const isDesktop = useCheckIfDesktop();

  const fio101ComponentProps = {
    firstFromListFioAddressName,
    hasFCH,
    hasOneFCH,
    hasDomains,
    isDesktop,
    loading,
    noMappedPubAddresses,
  };

  return {
    fio101ComponentProps,
    isDesktop,
    totalBalance,
    totalBalanceLoading: isFioWalletsBalanceLoading,
    welcomeComponentProps: { ...allFioNamesAndWallets, withoutMarginTop: true },
  };
};
