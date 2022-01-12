import { RouteComponentProps } from 'react-router-dom';
import {
  FioCryptoHandleDoublet,
  FioWalletDoublet,
  WalletBalances,
} from '../../types';

type MatchProps = {
  publicKey: string;
};

export type RequestTokensValues = {
  payeeFioAddress: string;
  payerFioAddress: string;
  chainCode: string;
  tokenCode: string;
  payeeTokenPublicAddress: string;
  amount: number;
  memo?: string;
};

export type RequestTokensProps = {
  fioWallet: FioWalletDoublet;
  fioCryptoHandles: FioCryptoHandleDoublet[];
  balance: WalletBalances;
  loading: boolean;
  onSubmit: (values: RequestTokensValues) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  fioCryptoHandles: FioCryptoHandleDoublet[];
  loading: boolean;
  roe: number;
  balance: WalletBalances;
  refreshBalance: (publicKey: string) => void;
}
