import { RouteComponentProps } from 'react-router-dom';
import React from 'react';
import {
  FioAddressDoublet,
  FioWalletDoublet,
  MappedPublicAddresses,
  WalletBalances,
} from '../../types';

type MatchProps = {
  publicKey: string;
};

export type RequestTokensValues = {
  payeeFioAddress: string;
  payerFioAddress: string;
  chainCode: string;
  tokenCode: string;
  payeeTokenPublicAddress: string;
  amount: string;
  memo?: string;
};

export type RequestTokensProps = {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  pubAddressesMap: MappedPublicAddresses;
  balance: WalletBalances;
  loading: boolean;
  roe: number;
  contactsList: string[];
  isFio?: boolean;
  onSubmit: (values: RequestTokensValues) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  fioWalletsLoading: boolean;
  roe: number;
  balance: WalletBalances;
  contactsList: string[];
  contactsLoading: boolean;
  refreshBalance: (publicKey: string) => void;
  getContactsList: () => void;
  createContact: (name: string) => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
}
