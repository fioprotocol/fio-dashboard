import { RouteComponentProps } from 'react-router-dom';
import {
  FioWalletDoublet,
  FeePrice,
  FioNameItemProps,
  WalletBalancesItem,
} from '../../types';

type MatchParams = {
  id: string;
};

export type FormProps = {
  statusToChange: string;
  feePrice: FeePrice;
  name: string;
  hasLowBalance: boolean;
  processing: boolean;
  walletBalancesTotal: WalletBalancesItem;
  handleSubmit: () => void;
};

export type ContainerOwnProps = RouteComponentProps<MatchParams>;

export type ContainerProps = {
  children?: React.ReactNode;
  selectedFioDomain: FioNameItemProps;
  feePrice: FeePrice;
  roe: number | null;
  fioWallet: FioWalletDoublet;
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
} & ContainerOwnProps;
