import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FioWalletDoublet } from '../../types';

type MatchProps = {
  publicKey: string;
  id: number;
};

type LocationProps = {
  location: {
    query?: {
      publicKey?: string;
      fioRequestId?: string;
    };
  };
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallets: FioWalletDoublet[];
  loading: boolean;
  roe: number;
  refreshBalance: (publicKey: string) => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
  setConfirmPinKeys: (keys: null) => void;
}
