import { History } from 'history';

import {
  FioWalletDoublet,
  PageNameType,
  FioNameItemProps,
} from '../../../types';
import {getPrices} from "../../../redux/registrations/actions";

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  pageName: PageNameType;
  history: History;
};

export type ContainerProps = {
  children?: React.ReactNode;
  feePrice: { costFio: number | null; costUsdc: number | null };
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
  getFee: (fioName: string) => void;
  getPrices: () => void;
} & ContainerOwnProps;
