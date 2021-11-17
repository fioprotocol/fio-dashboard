import { RouteComponentProps } from 'react-router-dom';
import {
  FeePrice,
  FioAddressDoublet,
  FioWalletDoublet,
  WalletBalances,
} from '../../types';

type MatchProps = {
  publicKey: string;
};

export type SendTokensValues = {
  from?: string;
  fromPubKey: string;
  to: string;
  receiverFioAddress?: string;
  amount: number;
  memo?: string;
};

export type SendTokensProps = {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  fee: FeePrice;
  balance: WalletBalances;
  loading: boolean;
  obtDataOn?: boolean;
  onSubmit: (values: SendTokensValues) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  loading: boolean;
  roe: number;
  feePrice: FeePrice;
  balance: WalletBalances;
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
}
