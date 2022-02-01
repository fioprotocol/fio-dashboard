import { RouteComponentProps } from 'react-router-dom';
import { FioWalletData, FioWalletDoublet, WalletBalances } from '../../types';

type MatchProps = {
  publicKey: string;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet | null;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
  balance: WalletBalances;
  fioWalletsData: {
    [publicKey: string]: FioWalletData;
  };
}

export type EditWalletNameValues = {
  name: string;
};

export type EditWalletNameProps = {
  loading: boolean;
  initialValues?: EditWalletNameValues;
  onSubmit: (values: EditWalletNameValues) => void;
};

export type PasswordFormValues = {
  password: string;
  username: string;
};

export type FioDataItemContentProps = {
  payeePublicAddress: string;
  amount: string;
  chain: string;
  memo: string;
  txId?: string;
};

export type FioDataItemProps = {
  from: string;
  to: string;
  date: string;
  status?: string;
  id: string;
  payer: string;
  requestor: string;
  type: string;
  content?: FioDataItemContentProps;
};

export type FioDataItemKeysProps =
  | 'amount'
  | 'chain'
  | 'date'
  | 'from'
  | 'memo'
  | 'payer'
  | 'requestor'
  | 'to'
  | 'type'
  | 'txId';
