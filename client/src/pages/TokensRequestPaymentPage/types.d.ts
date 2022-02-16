import { RouteComponentProps } from 'react-router-dom';
import { FeePrice, FioAddressDoublet, FioWalletDoublet } from '../../types';

type MatchProps = {
  publicKey: string;
};

export type PaymentDetailsValues = {
  payeeFioAddress: string;
  payerFioAddress: string;
  payerTokenPublicAddress: string;
  payeeTokenPublicAddress: string;
  payeeFioPublicKey: string;
  amount: string;
  chainCode: string;
  tokenCode: string;
  obtId: string;
  memo?: string;
  fioRequestId: number;
  payeePublicAddress: string;
};

export type PaymentDetailsResultValues = {
  amount: string;
  blockNum: number;
  chainCode: string;
  feeCollected?: FeePrice;
  fioRequestId: number;
  memo?: string;
  obtId: string;
  payeeFioAddress: string;
  payeeFioPublicKey: string;
  payeePublicAddress: string;
  payerFioAddress: string;
  status: string | number;
  tokenCode: string;
  transactionId: string;
};

export type TxValues = {
  transactionId: string;
  status: string;
  feeCollected?: FeePrice;
  blockNum: number;
};

export type PaymentDetailsProps = {
  initialValues: {
    payerFioAddress: string;
    payeeFioAddress: string;
    payeeFioPublicKey: string;
    payeePublicAddress: string;
    memo: string;
    amount: string;
    chainCode: string;
    tokenCode: string;
    obtId: string;
    fioRequestId: number;
  };
  fioWallet: FioWalletDoublet;
  senderFioAddress: FioAddressDoublet;
  loading: boolean;
  obtDataOn?: boolean;
  onSubmit: (values: PaymentDetailsValues) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  refreshWalletDataPublicKey: (publicKey: string) => void;
  loading: boolean;
  contactsList: string[];
  getContactsList: () => void;
  createContact: (name: string) => void;
}
