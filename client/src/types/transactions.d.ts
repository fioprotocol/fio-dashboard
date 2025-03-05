import { FioWalletDoublet, Roe } from '../types';

export type HandleTransactionDetailsProps = {
  bundles?: number;
  feeCollected?: string;
  remaningBundles?: number;
  roe?: Roe;
  shouldSubBundlesFromRemaining?: boolean;
  shouldSubFeesFromBalance?: boolean;
  transactionId?: string;
  fioWallet?: FioWalletDoublet;
};
