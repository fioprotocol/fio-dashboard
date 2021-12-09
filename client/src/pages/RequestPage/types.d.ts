import { RouteComponentProps } from 'react-router-dom';
import { FeePrice, FioAddressDoublet, FioWalletDoublet } from '../../types';

type MatchProps = {
  publicKey: string;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export type FIORequestFormValues = {
  fioAddressRequestFrom?: string;
  fioAddressRequestTo?: string;
  requestAmount?: number;
  token?: string;
  chainId?: string;
  memo?: string;
  costFio: FeePrice;
};
export type FIORequestFormProps = {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  fee: FeePrice;
  formSendValues: FIORequestFormValues;
  onSubmit: (values: FIORequestFormValues) => void;
  loading: boolean;
};
