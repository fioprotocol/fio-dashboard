import { RouteComponentProps } from 'react-router-dom';
import { FioWalletDoublet, WalletsBalances } from '../../types';

export interface ContainerProps extends RouteComponentProps {
  children?: React.ReactNode;
  fioWallets: FioWalletDoublet[];
  noProfileLoaded?: boolean;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
  roe: number;
  balance: WalletsBalances;
}

export type CreateWalletValues = {
  name: string;
  ledger: boolean;
};

export type CreateWalletProps = {
  loading: boolean;
  initialValues: CreateWalletValues;
  onSubmit: (values: CreateWalletValues) => void;
};
