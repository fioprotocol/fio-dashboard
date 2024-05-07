import React from 'react';
import { FormRenderProps } from 'react-final-form';

import { FormValues } from '../../../pages/AddTokenPage/types';

import {
  FeePrice,
  FioAddressWithPubAddresses,
  LinkActionResult,
  PublicAddressDoublet,
  AnyType,
} from '../../../types';

export type ResultsData = {
  feeCollected?: FeePrice;
  bundlesCollected?: number;
  name?: string;
  publicKey?: string;
  changedStatus?: string;
  other?: AnyType;
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
  onClose: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
  isPaymentDetailsVisible?: boolean;
};

export type ResultsContainerProps = ResultsProps & {
  children: React.ReactNode;
  onTxResultsClose: () => void;
};

export type LinkTokenResultsProps = {
  containerName: string;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  results: LinkActionResult;
  bundleCost: number;
  changeBundleCost: (bundleCost: number) => void;
  onBack: (formProps?: FormRenderProps<FormValues>) => void;
  onRetry: (results: LinkActionResult) => void;
};
