import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FeePriceOptionItem } from '../../components/ConnectWallet/FeesModal/FeesModalInput';
import {
  ConnectProviderType,
  NetworkType,
} from '../../hooks/externalWalletsConnection/useInitializeProviderConnection';
import { NtfsItems } from '../../hooks/externalWalletsConnection/useGetWrappedFioData';
import { Roe } from '../../types';

type MatchProps = {
  publicKey: string;
};

export type UnWrapDomainValues = {
  publicAddress: string;
  chainCode: string;
  wrappedDomainTokenId: string;
  fioAddress: string;
  fee: FeePriceOptionItem;
};

export type InitialValues = {
  chainCode: string;
  fee: FeePriceOptionItem;
};

export type UnWrapDomainFormProps = {
  loading: boolean;
  initialValues?: InitialValues;
  onSubmit: (data: UnWrapDomainValues) => void;
  updateAddressInPage: (address: string) => void;
  providerData: ConnectProviderType;
  isWrongNetwork: boolean;
  network: NetworkType;
  fioAddressesList: string[];
  wrappedDomainsList?: NtfsItems;
  modalInfoError?: string;
  setModalInfoError: (error: string) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  loading: boolean;
  roe: Roe;
}
