import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FeePrice,
  FioAddressDoublet,
  FioWalletDoublet,
  MappedPublicAddresses,
  Roe,
} from '../../types';

type LocationProps = {
  location: {
    state: {
      payeeFioAddress: string;
    };
    query?: {
      publicKey?: string;
    };
  };
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
  payerFioPublicKey?: string;
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
  extends RouteComponentProps<{}, {}, LocationState> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallets: FioWalletDoublet[];
  fioWalletsLoading: boolean;
  roe: Roe;
  feePrice: FeePrice;
  contactsList: string[];
  contactsLoading: boolean;
  getContactsList: () => void;
  createContact: (name: string) => void;
  refreshWalletDataPublicKey: (publicKey?: string) => void;
  getFee: (fioAddress: string) => void;
}
