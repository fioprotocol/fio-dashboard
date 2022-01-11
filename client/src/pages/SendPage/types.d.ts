import { RouteComponentProps } from 'react-router-dom';
import {
  FeePrice,
  FioCryptoHandleDoublet,
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
  receiverFioCryptoHandle?: string;
  amount: number;
  memo?: string;
};

export type SendTokensProps = {
  fioWallet: FioWalletDoublet;
  fioCryptoHandles: FioCryptoHandleDoublet[];
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
  fioCryptoHandles: FioCryptoHandleDoublet[];
  loading: boolean;
  roe: number;
  feePrice: FeePrice;
  balance: WalletBalances;
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
}
