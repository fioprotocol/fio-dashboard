import { History } from 'history';

import { FioWalletDoublet, FioAddressDoublet, FeePrice } from '../../types';

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
  onSubmit: (values: NftFormValues) => Promise<any>;
  initialValues?: NftFormValues;
  fieldValuesChanged: () => void;
  selectedFioAddressName: string;
  fioAddresses: FioAddressDoublet[];
  fioAddress?: FioAddressDoublet;
  setSelectedFioAddress: (value: string) => void;
  bundleCost: number;
  hasLowBalance: boolean;
  processing: boolean;
  isEdit?: boolean;
  addressSelectOff?: boolean;
};
