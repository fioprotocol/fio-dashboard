import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FeePrice,
  FioAddressDoublet,
  FioNameItemProps,
  FioWalletDoublet,
  WalletBalances,
} from '../../types';

type MatchProps = {
  publicKey: string;
};

export type ResultsData = {
  name: string;
  chainCode: string;
  publicAddress: string;
  feeCollectedAmount: number;
  nativeFeeCollectedAmount: number;
  other?: { transaction_id?: string };
  error?: string | null;
};

export type WrapDomainValues = {
  name: string;
  tpid: string;
  chainCode: string;
  publicAddress: string;
};

export type InitialValues = {
  tpid: string;
  chainCode: string;
  name: string;
};

export type WrapDomainFormProps = {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  fee: FeePrice;
  oracleFee: FeePrice;
  roe?: number;
  balance: WalletBalances;
  loading: boolean;
  initialValues?: InitialValues;
  onSubmit: (values: WrapDomainValues) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  currentWallet: FioWalletDoublet;
  loading: boolean;
  roe: number;
  name: string;
  feePrice: FeePrice;
  oracleFeePrice: FeePrice;
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
  getOracleFees: () => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
  resetFioNames: () => void;
}

export type LocationProps = {
  location: {
    query: {
      name: string;
    };
  };
};

export type Props = {
  fioNameList: FioNameItemProps[];
  fees: { [endpoint: string]: FeePrice };
};
