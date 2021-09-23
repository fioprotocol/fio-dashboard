import { History } from 'history';

import {
  FioWalletDoublet,
  PinConfirmation,
  FioAddressDoublet, WalletKeys,
} from '../../types';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';

export type ContainerOwnProps = {
  history: History;
};

export type ContainerProps = {
  fioAddresses: FioAddressDoublet[];
  fioWallets: FioWalletDoublet[];
  fee: number;
  result: { feeCollected?: number; error?: string };
  singNFT: (publicKey: string, nfts: NftItem[], keys: WalletKeys) => void;

  match: {
    params: { address: string };
  };
  loading: boolean;
  signNftProcessing: boolean;
  refreshBalance: (publicKey: string) => void;
  getFee: (fioAddress: string) => void;
  showPinModal: (action: string, data: any) => void;
  resetPinConfirm: () => void;
  pinConfirmation: PinConfirmation;
} & ContainerOwnProps;
