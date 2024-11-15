import { FioWalletDoublet } from '../types';

export type HandleTransactionDetailsProps = {
  bundles?: number;
  feeCollected?: number;
  remaningBundles?: number;
  roe?: number;
  shouldSubBundlesFromRemaining?: boolean;
  transactionId?: string;
  fioWallet?: FioWalletDoublet;
};
