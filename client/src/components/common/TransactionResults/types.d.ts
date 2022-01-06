import React from 'react';
import { FeePrice, PublicAddressDoublet } from '../../../types';

export type ResultsData = {
  feeCollected?: FeePrice;
  name?: string;
  publicKey?: string;
  changedStatus?: string;
  other?: any;
  error?: string;
  updated?: PublicAddressDoublet[];
  failed?: PublicAddressDoublet[];
};

export type ResultsProps = {
  title: string;
  hasAutoWidth?: boolean;
  fullWidth?: boolean;
  bottomElement?: React.ReactNode;
  pageName?: string;
  errorType?: string;
  results: ResultsData;
  onClose: () => void;
  onRetry?: () => void;
};

export type ResultsContainerProps = ResultsProps & {
  children: React.ReactNode;
};
