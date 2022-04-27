import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FioWalletData,
  FioWalletDoublet,
  WalletBalances,
  DecryptedFioRecordContent,
  FioWalletTxHistory,
} from '../../types';

type MatchProps = {
  publicKey: string;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet | null;
  loading: boolean;
  profileRefreshed: boolean;
  refreshBalance: (publicKey: string) => void;
  balance: WalletBalances;
  fioWalletsData: {
    [publicKey: string]: FioWalletData;
  };
  fioWalletsTxHistory: {
    [publicKey: string]: FioWalletTxHistory;
  };
}

export type EditWalletNameValues = {
  name: string;
};

export type EditWalletNameProps = {
  loading: boolean;
  initialValues?: EditWalletNameValues;
  onSubmit: (values: EditWalletNameValues) => void;
};

export type PasswordFormValues = {
  password: string;
  username: string;
};

export type FioRecordViewProps = {
  from: string;
  to: string;
  payeeFioPublicKey: string;
  date: string;
  status?: string;
  id: number;
  content: string;
  fioTxType: string;
};

export type FioRecordViewDecrypted = {
  fioRecord: FioRecordViewProps;
  fioDecryptedContent: DecryptedFioRecordContent;
};

export type FioRecordViewKeysProps =
  | 'amount'
  | 'chainCode'
  | 'date'
  | 'from'
  | 'memo'
  | 'to'
  | 'type'
  | 'obtId';
