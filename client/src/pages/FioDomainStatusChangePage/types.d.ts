import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FioWalletDoublet,
  FeePrice,
  WalletBalancesItem,
  FioNameItemProps,
} from '../../types';

type LocationProps = {
  location: {
    query: {
      name: string;
      backPath?: string;
    };
  };
};

export type FioDomainStatusValues = {
  name: string;
  publicStatusToSet: number;
};

export type FormProps = {
  statusToChange: string;
  feePrice: FeePrice;
  name: string;
  hasLowBalance: boolean;
  processing: boolean;
  walletBalancesAvailable: WalletBalancesItem;
  fioWallet: FioWalletDoublet;
  handleSubmit: () => void;
  backLink?: string;
};

export type ContainerOwnProps = RouteComponentProps & LocationProps;

export type ContainerProps = {
  children?: React.ReactNode;
  selectedFioDomain: FioNameItemProps;
  feePrice: FeePrice;
  roe: number | null;
  fioWallet: FioWalletDoublet;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
} & ContainerOwnProps;
