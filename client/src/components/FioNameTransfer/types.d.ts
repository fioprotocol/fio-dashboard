import React from 'react';
import { History } from 'history';

import {
  FioWalletDoublet,
  FioNameType,
  FioNameItemProps,
  FeePrice,
  Roe,
} from '../../types';

export type FioNameTransferValues = {
  name: string;
  fioNameType: FioNameType;
  newOwnerPublicKey: string;
};

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  fioNameType: FioNameType;
  history: History;
};

export type ContainerProps = {
  children?: React.ReactNode;
  feePrice: FeePrice;
  roe: Roe;
  currentWallet: FioWalletDoublet;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
  getFee: (isFioAddress: boolean) => void;
} & ContainerOwnProps;

export type FormProps = {
  name: string;
  walletName?: string;
  fioNameType: FioNameType;
  feePrice: FeePrice;
  publicKey: string;
  onSubmit: (value: string) => void;
  processing: boolean;
};
