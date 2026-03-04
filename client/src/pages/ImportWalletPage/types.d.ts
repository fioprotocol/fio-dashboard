import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FioWalletDoublet, NewFioWalletDoublet, Nonce } from '../../types';
import { SiteSetting } from '../../types/settings';

export interface ContainerProps extends RouteComponentProps {
  children?: React.ReactNode;
  fioWallets: FioWalletDoublet[];
  noProfileLoaded?: boolean;
  loading: boolean;
  addWalletLoading: boolean;
  addWallet: (walletData: NewFioWalletDoublet, nonce: Nonce) => void;
  siteSetings: SiteSetting;
  showGenericErrorModal: (
    message?: string,
    title?: string,
    buttonText?: string,
  ) => void;
}

export type ImportWalletValues = {
  privateSeed: string;
  name: string;
};

export type ImportWalletFormProps = {
  loading: boolean;
  onSubmit: (values: ImportWalletValues) => void;
};
