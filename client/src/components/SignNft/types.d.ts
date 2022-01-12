import { History } from 'history';

import {
  FioWalletDoublet,
  FioCryptoHandleDoublet,
  FeePrice,
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
  fioCryptoHandleName: string;
  backTo?: string;
  history: History;
  isEdit?: boolean;
};

export type ContainerProps = {
  fioCryptoHandles: FioCryptoHandleDoublet[];
  fioWallets: FioWalletDoublet[];
  feePrice: FeePrice;

  match: {
    params: { address: string };
  };
  loading: boolean;
  addressSelectOff?: boolean;
  getFee: (fioCryptoHandle: string) => void;
  refreshFioNames: (publicKey: string) => void;
  getNFTSignatures: (searchParams: { fioCryptoHandle: string }) => void;
} & ContainerOwnProps;

export type SignNftFormProps = {
  alreadySigned: boolean;
  onSubmit: (values: NftFormValues) => Promise<any>;
  initialValues: NftFormValues | null;
  fieldValuesChanged: () => void;
  selectedFioCryptoHandleName: string;
  fioCryptoHandles: FioCryptoHandleDoublet[];
  fioCryptoHandle: FioCryptoHandleDoublet;
  setSelectedFioCryptoHandle: (value: string) => void;
  bundleCost: number;
  hasLowBalance: boolean;
  processing: boolean;
  isEdit?: boolean;
  addressSelectOff?: boolean;
};
