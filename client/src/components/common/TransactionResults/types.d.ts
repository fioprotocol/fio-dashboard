import React from 'react';

import {
  FeePrice,
  PublicAddressDoublet,
  FioAddressWithPubAddresses,
  LinkActionResult,
} from '../../../types';

export type ResultsData = {
  feeCollected?: FeePrice;
  bundlesCollected?: number;
  name?: string;
  publicKey?: string;
  changedStatus?: string;
  other?: any;
  error?: string | null;
  updated?: PublicAddressDoublet[];
  failed?: PublicAddressDoublet[];
  obtError?: string;
  fioRequestId?: number;
};

export type ResultsProps = {
  title: string;
  titleTo?: string;
  titleFrom?: string;
  titleAmount?: string;
  hasAutoWidth?: boolean;
  fullWidth?: boolean;
  middleWidth?: boolean;
  bottomElement?: React.ReactNode;
  pageName?: string;
  errorType?: string;
  results: ResultsData;
  roe?: number;
  onClose: () => void;
  onRetry?: () => void;
};

export type ResultsContainerProps = ResultsProps & {
  children: React.ReactNode;
};

export type LinkTokenResultsProps = {
  containerName: string;
  fioCryptoHandle: FioAddressWithPubAddresses;
  results: LinkActionResult;
  bundleCost: number;
  changeBundleCost: (bundleCost: number) => void;
  onBack: () => void;
  onRetry: (results: LinkActionResult) => void;
};
