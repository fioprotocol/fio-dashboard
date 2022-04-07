import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FioAddressDoublet,
  FioWalletDoublet,
  MappedPublicAddresses,
} from '../../types';

type MatchProps = {
  publicKey?: string;
};

type LocationState = {
  payeeFioAddress: string;
};

export type RequestTokensValues = {
  payeeFioAddress: string;
  payerFioAddress: string;
  chainCode: string;
  tokenCode: string;
  payeeTokenPublicAddress: string;
  amount: string;
  memo?: string;
  mapPubAddress?: boolean;
};

export type RequestTokensInitialValues = {
  payeeFioAddress?: string;
  payeeTokenPublicAddress?: string;
  tokenCode?: string;
  chainCode?: string;
  mapPubAddress?: boolean;
};

export type RequestTokensProps = {
  initialValues?: RequestTokensInitialValues;
  fioAddresses: FioAddressDoublet[];
  pubAddressesMap: MappedPublicAddresses;
  loading: boolean;
  contactsList: string[];
  isFio?: boolean;
  onSubmit: (values: RequestTokensValues) => void;
};

export interface ContainerOwnProps
  extends RouteComponentProps<MatchProps, {}, LocationState> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallets: FioWalletDoublet[];
  fioWalletsLoading: boolean;
  roe: number;
  contactsList: string[];
  contactsLoading: boolean;
  getContactsList: () => void;
  createContact: (name: string) => void;
  refreshWalletDataPublicKey: (publicKey?: string) => void;
}
