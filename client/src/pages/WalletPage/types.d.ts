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
