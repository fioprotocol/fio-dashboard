import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FioAddressDoublet, FioWalletDoublet } from '../../types';

type LocationProps = {
  location: {
    query?: {
      publicKey?: string;
    };
  };
};

export interface ContainerOwnProps extends RouteComponentProps {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  fioCryptoHandles: FioAddressDoublet[];
}
