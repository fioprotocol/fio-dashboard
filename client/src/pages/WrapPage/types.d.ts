import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FeePrice,
  FioAddressDoublet,
  FioWalletDoublet,
  WalletBalances,
} from '../../types';

type MatchProps = {
  publicKey: string;
};

export type ResultsData = {
  amount: string;
  chainCode: string;
  publicAddress: string;
  feeCollectedAmount: number;
  nativeFeeCollectedAmount: number;
  other?: any;
  error?: string | null;
};

export type WrapTokensValues = {
  tpid: string;
  chainCode: string;
  amount: string;
  publicAddress: string;
};

export type InitialValues = {
  tpid: string;
  chainCode: string;
};

export type WrapTokensFormProps = {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  fee: FeePrice;
  oracleFee: FeePrice;
  roe?: number;
  balance: WalletBalances;
  loading: boolean;
  obtDataOn?: boolean;
  initialValues?: InitialValues;
  onSubmit: (values: WrapTokensValues) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  loading: boolean;
  roe: number;
  feePrice: FeePrice;
  oracleFeePrice: FeePrice;
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
  getOracleFees: () => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
}
