import { FormErrors } from 'redux-form';
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
  transferAddressValue: string;
  refreshBalance: (publicKey: string) => void;
  transfer: (params: {
    fioName: string;
    newOwnerFioAddress?: string;
    newOwnerKey?: string;
    fee: number;
    keys: { public: string; private: string };
  }) => void;
} & ContainerOwnProps;
