import { History } from 'history';

import {
  FioWalletDoublet,
  PinConfirmation,
  FioAddressDoublet,
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
  singNFT: (publicKey: string, nfts: NftItem[]) => void;

  match: {
    params: { address: string };
  };
  loading: boolean;
  refreshBalance: (publicKey: string) => void;
  getFee: (fioAddress: string) => void;
  showPinModal: (action: string) => void;
  resetPinConfirm: () => void;
  pinConfirmation: PinConfirmation;
} & ContainerOwnProps;
