import React from 'react';

import { DecryptedFioRecordContent } from '../../types';

export interface ContainerOwnProps {
  children?: React.ReactNode;
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

export type DeleteWalletFormValues = {
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
