import { History } from 'history';

import {
  FioWalletDoublet,
  PageNameType,
  FioNameItemProps,
} from '../../../types';

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  pageName: PageNameType;
  history: History;
};

export type ContainerProps = {
  children?: React.ReactNode;
  feePrice: { costFio: number; costUsdc: number };
  walletPublicKey: string;
  currentWallet: FioWalletDoublet;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
} & ContainerOwnProps;
