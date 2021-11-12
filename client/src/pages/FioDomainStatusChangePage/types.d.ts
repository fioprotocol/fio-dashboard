import { RouteComponentProps } from 'react-router-dom';
import { FioWalletDoublet, FeePrice, FioNameItemProps } from '../../types';

type MatchParams = {
  id: string;
};

export type FormProps = {
  statusToChange: string;
  fioWallet: FioWalletDoublet;
  feePrice: FeePrice;
  name: string;
  hasLowBalance: boolean;
  processing: boolean;
  handleSubmit: () => void;
};

export type ContainerOwnProps = RouteComponentProps<MatchParams>;

export type ContainerProps = {
  children?: React.ReactNode;
  selectedFioDomain: FioNameItemProps;
  fees: { [endpoint: string]: number };
  roe: number | null;
  fioWallet: FioWalletDoublet;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
} & ContainerOwnProps;
