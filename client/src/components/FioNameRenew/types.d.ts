import React from 'react';
import { History } from 'history';

import {
  FioNameType,
  FioNameItemProps,
  FioWalletDoublet,
  FeePrice,
} from '../../types';

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  fioNameType: FioNameType;
  history: History;
};

export type ContainerProps = {
  children?: React.ReactNode;
  feePrice: FeePrice;
  roe: number;
  fioDomains: FioWalletDoublet[];
  currentWallet: FioWalletDoublet;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
  getFee: (isFioAddress: boolean) => void;
} & ContainerOwnProps;
