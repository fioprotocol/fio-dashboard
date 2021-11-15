import { History } from 'history';

import { FioNameType, FioNameItemProps, FioWalletDoublet } from '../../types';

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  fioNameType: FioNameType;
  history: History;
};

export type ContainerProps = {
  children?: React.ReactNode;
  fee: number;
  roe: number;
  currentWallet: FioWalletDoublet;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
  getFee: (isFioAddress: boolean) => void;
} & ContainerOwnProps;
