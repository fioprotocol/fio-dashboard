import { RouteComponentProps } from 'react-router-dom';
import { FioWalletDoublet, WalletBalances } from '../../types';

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

export type TransactionItemProps = {
  from: string;
  to: string;
  date: string;
  status?: string;
  id: string;
  transactionType: string;
};
