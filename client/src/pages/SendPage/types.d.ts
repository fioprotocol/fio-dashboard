import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FeePrice,
  FioAddressDoublet,
  FioWalletDoublet,
  WalletBalances,
} from '../../types';

import { FioRecordViewDecrypted } from '../WalletPage/types';

type MatchProps = {
  publicKey: string;
};

export type SendTokensValues = {
  from?: string;
  fromPubKey: string;
  to: string;
  toPubKey?: string;
  amount: string;
  nativeAmount: string;
  memo?: string;
  fioRequestId?: number;
};

export type InitialValues = {
  from?: string;
  fromPubKey: string;
  to?: string;
  amount?: string;
  memo?: string;
  fioRequestId?: number;
  toPubKey?: string;
};

export type SendTokensProps = {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  fee: FeePrice;
  balance: WalletBalances;
  loading: boolean;
  obtDataOn?: boolean;
  contactsList: string[];
  initialValues?: InitialValues;
  onSubmit: (values: SendTokensValues) => void;
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
  contactsList: string[];
  contactsLoading: boolean;
  location: {
    state?: {
      fioRecordDecrypted: FioRecordViewDecrypted;
    };
  };
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
  getContactsList: () => void;
  createContact: (name: string) => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
}
