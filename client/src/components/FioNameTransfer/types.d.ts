import { History } from 'history';

import {
  FioWalletDoublet,
  FioNameType,
  FioNameItemProps,
  FeePrice,
} from '../../types';

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  fioNameType: FioNameType;
  history: History;
};

export type ContainerProps = {
  children?: React.ReactNode;
  fee: number | null;
  roe: number;
  currentWallet: FioWalletDoublet;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
  getFee: (isFioAddress: boolean) => void;
} & ContainerOwnProps;

export type FormProps = {
  name: string;
  fioNameType: FioNameType;
  feePrice: FeePrice;
  currentWallet: FioWalletDoublet;
  onSubmit: (value: string) => void;
  processing: boolean;
};
