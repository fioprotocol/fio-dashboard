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

export type StakeTokensValues = {
  publicKey: string;
  fioAddress?: string;
  amount: string;
  nativeAmount: string;
  proxy: string;
};

export type InitialValues = {
  fioAddress?: string;
  publicKey: string;
  proxy: string;
};

export type StakeTokensProps = {
  fioAddresses: FioAddressDoublet[];
  fee: FeePrice;
  balance: WalletBalances;
  loading: boolean;
  initialValues?: InitialValues;
  proxyList: string[];
  onSubmit: (values: StakeTokensValues) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  loading: boolean;
  roe: number;
  feePrice: FeePrice;
  balance: WalletBalances;
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
}
