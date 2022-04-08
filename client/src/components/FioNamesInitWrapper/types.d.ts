import React from 'react';

import {
  FioAddressDoublet,
  FioDomainDoublet,
  FioWalletDoublet,
} from '../../types';

export type Props = {
  children: React.ReactElement;
  profileRefreshed: boolean;
  fioWallets: FioWalletDoublet[];
  fioAddresses: FioAddressDoublet[];
  fioDomains: FioDomainDoublet[];
  refreshFioNames: (publicKey: string) => void;
  loading: boolean;
  fioNamesInitRefreshed: { [publicKey: string]: boolean };
};
