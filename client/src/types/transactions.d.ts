import { FioWalletDoublet } from '../types';

export type HandleTransactionDetailsProps = {
  bundles?: number;
  feeCollected?: number;
  remaningBundles?: number;
  roe?: string;
  shouldSubBundlesFromRemaining?: boolean;
  shouldSubFeesFromBalance?: boolean;
  transactionId?: string;
  fioWallet?: FioWalletDoublet;
};
