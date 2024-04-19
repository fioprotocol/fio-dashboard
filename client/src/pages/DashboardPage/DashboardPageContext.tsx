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
  isLoading: boolean;
  hasAddresses: boolean;
  totalBalance: WalletBalancesItem;
  welcomeComponentProps: {
    firstFromListFioAddressName: string;
    firstFromListFioDomainName: string;
    firstFromListFioWalletPublicKey: string;
    hasAffiliate: boolean;
    hasDomains: boolean;
    hasAddresses: boolean;
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
    isLoading: isFioWalletsBalanceLoading || loading,
    hasAddresses: allFioNamesAndWallets.hasAddresses,
    totalBalance,
    welcomeComponentProps: { ...allFioNamesAndWallets, withoutMarginTop: true },
  };
};
