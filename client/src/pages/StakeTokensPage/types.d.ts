import { RouteComponentProps } from 'react-router-dom';
import {
  FeePrice,
  FioAddressDoublet,
  FioWalletDoublet,
  WalletBalances,
} from '../../types';

import { FioRecordViewDecrypted } from '../WalletPage/types';

type MatchProps = {
  publicKey: string;
};

export type StakeTokensValues = {
  publicKey: string;
  fioAddress?: string;
  amount: string;
  nativeAmount: string;
};

export type InitialValues = {
  fioAddress?: string;
  publicKey: string;
};

export type StakeTokensProps = {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  roe: number;
  fee: FeePrice;
  balance: WalletBalances;
  loading: boolean;
  initialValues?: InitialValues;
  onSubmit: (values: StakeTokensValues) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  loading: boolean;
  roe: number;
  feePrice: FeePrice;
  balance: WalletBalances;
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
}
