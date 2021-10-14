import { History } from 'history';

import {
  FioWalletDoublet,
  PinConfirmation,
  FioAddressDoublet,
  WalletKeys,
  NFTTokenDoublet,
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
  fee: number;
  result: {
    feeCollected?: number;
    error?: string;
    other?: { nfts: NFTTokenDoublet[] };
  };
  singNFT: (
    publicKey: string,
    nfts: NFTTokenDoublet[],
    keys: WalletKeys,
  ) => void;

  match: {
    params: { address: string };
  };
  loading: boolean;
  signNftProcessing: boolean;
  getFee: (fioAddress: string) => void;
  showPinModal: (action: string, data: any) => void;
  resetPinConfirm: () => void;
  pinConfirmation: PinConfirmation;
  refreshFioNames: (publicKey: string) => void;
  getSignaturesFromFioAddress: (fioAddress: string) => void;
} & ContainerOwnProps;

export type SignNftFormProps = {
  alreadySigned: boolean;
  onSubmit: (values: NftFormValues) => Promise<any>;
  initialValues: NftFormValues | null;
  fieldValuesChanged: () => void;
  selectedFioAddressName: string;
  fioAddresses: FioAddressDoublet[];
  fioAddress: FioAddressDoublet;
  setSelectedFioAddress: (value: string) => void;
  bundleCost: number;
  hasLowBalance: boolean;
  processing: boolean;
  isEdit?: boolean;
};
