import { History } from 'history';

import {
  FioWalletDoublet,
  FioAddressDoublet,
  FeePrice,
  AnyObject,
} from '../../types';

export type NftFormValues = {
  chainCode: string;
  contractAddress: string;
  tokenId: string;
  url: string;
  hash: string;
  creatorUrl: string;
};

export type ContainerOwnProps = {
  initialValues: NftFormValues;
  fioAddressName: string;
  backTo?: string;
  history: History;
  isEdit?: boolean;
};

export type ContainerProps = {
  fioAddresses: FioAddressDoublet[];
  fioWallets: FioWalletDoublet[];
  feePrice: FeePrice;

  match: {
    params: { address: string };
  };
  loading: boolean;
  addressSelectOff?: boolean;
  getFee: (fioAddress: string) => void;
  refreshFioNames: (publicKey: string) => void;
  getNFTSignatures: (searchParams: { fioAddress: string }) => void;
} & ContainerOwnProps;

export type SignNftFormProps = {
  alreadySigned: boolean;
  onSubmit: (values: NftFormValues) => Promise<AnyObject>;
  initialValues?: NftFormValues;
  fieldValuesChanged: () => void;
  selectedFioAddressName: string;
  fioAddresses: FioAddressDoublet[];
  fioAddress?: FioAddressDoublet;
  onFioHandleChange: (value: string) => void;
  bundleCost: number;
  hasLowBalance: boolean;
  processing: boolean;
  isEdit?: boolean;
  addressSelectOff?: boolean;
  currentWallet: FioWalletDoublet;
  loading: boolean;
};
