import { OverviewWallet } from '../types/governance';

export const overviewWalletHasLowBalanceAndHasProxy = (
  overviewWallets: OverviewWallet[],
): {
  hasLowBalance: boolean;
  hasProxy: boolean;
} => {
  const hasLowBalance =
    overviewWallets?.length === 1 && !overviewWallets[0]?.balance;

  const hasProxy =
    overviewWallets?.length === 1 && overviewWallets[0]?.hasProxy;

  return {
    hasLowBalance,
    hasProxy,
  };
};
