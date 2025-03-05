import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FioAddressDoublet, FioWalletDoublet, Roe } from '../../types';
import { FeePriceOptionItem } from '../../components/ConnectWallet/FeesModal/FeesModalInput';
import {
  ConnectProviderType,
  NetworkType,
} from '../../hooks/externalWalletsConnection/useInitializeProviderConnection';

type MatchProps = {
  publicKey: string;
};

export type UnWrapTokensValues = {
  chainCode: string;
  amount: string;
  fioAddress: string;
  fee: FeePriceOptionItem;
};

export type InitialValues = {
  chainCode: string;
  fee: FeePriceOptionItem;
};

export type WrapTokensFormProps = {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  loading: boolean;
  isWrongNetwork: boolean;
  network: NetworkType;
  initialValues?: InitialValues;
  onSubmit: (data: UnWrapTokensValues) => void;
  updateAddressInPage: (address: string) => void;
  providerData: ConnectProviderType;
  fioAddressesList: string[];
  modalInfoError?: string;
  setModalInfoError: (error: string) => void;
  wFioBalance: string | null;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  loading: boolean;
  roe: Roe;
  refreshWalletDataPublicKey: (publicKey: string) => void;
}
