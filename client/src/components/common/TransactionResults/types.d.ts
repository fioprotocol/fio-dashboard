import React from 'react';
import { FormRenderProps } from 'react-final-form';

import { AddTokenValues } from '../../../pages/AddTokenPage/types';

import {
  FeePrice,
  FioAddressWithPubAddresses,
  LinkActionResult,
  PublicAddressDoublet,
  AnyType,
  WalletBalancesItem,
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
  payWith?: {
    walletBalances: WalletBalancesItem;
    walletName?: string;
  };
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
  onBack: (formProps?: FormRenderProps<AddTokenValues>) => void;
  onRetry: (results: LinkActionResult) => void;
};
