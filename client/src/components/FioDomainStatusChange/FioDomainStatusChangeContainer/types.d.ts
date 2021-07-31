import { History } from 'history';

import {
  FioWalletDoublet,
  FioNameItemProps,
  DomainStatusType,
} from '../../../types';

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  history: History;
};

export type ContainerProps = {
  children?: React.ReactNode;
  domainStatus: DomainStatusType;
  feePrice: { costFio: number; costUsdc: number };
  walletPublicKey: string;
  currentWallet: FioWalletDoublet;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
} & ContainerOwnProps;
