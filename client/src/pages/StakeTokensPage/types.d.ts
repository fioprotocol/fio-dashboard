import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FeePrice,
  FioAddressDoublet,
  FioWalletDoublet,
  Roe,
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
  fioWallet: FioWalletDoublet;
  balance: WalletBalances;
  loading: boolean;
  initialValues?: InitialValues;
  isWalletFioAddressesLoading: boolean;
  proxyList: string[];
  proxyLoading: boolean;
  onSubmit: (values: StakeTokensValues) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  loading: boolean;
  roe: Roe;
  feePrice: FeePrice;
  balance: WalletBalances;
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
}
