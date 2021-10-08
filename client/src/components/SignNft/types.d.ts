import { History } from 'history';

import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';
import {
  FioWalletDoublet,
  PinConfirmation,
  FioAddressDoublet,
  WalletKeys,
} from '../../types';

export type NftFormValues = {
  chain_code: string;
  contract_address: string;
  token_id: string;
  url: string;
  hash: string;
  creator_url: string;
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
    other?: { nfts: NftItem[] };
  };
  singNFT: (publicKey: string, nfts: NftItem[], keys: WalletKeys) => void;

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
