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

export type SendTokensValues = {
  from?: string;
  fromPubKey: string;
  to: string;
  toPubKey?: string;
  amount: string;
  nativeAmount: string;
  memo?: string;
  fioRequestId?: number;
};

export type SendTokensProps = {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  roe: number;
  fee: FeePrice;
  balance: WalletBalances;
  loading: boolean;
  obtDataOn?: boolean;
  contactsList: string[];
  fioRecordDecrypted: FioRecordViewDecrypted;
  onSubmit: (values: SendTokensValues) => void;
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
  contactsList: string[];
  contactsLoading: boolean;
  location: {
    state?: {
      fioRecordDecrypted: FioRecordViewDecrypted;
    };
  };
  refreshBalance: (publicKey: string) => void;
  getFee: () => void;
  getContactsList: () => void;
  createContact: (name: string) => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
}
