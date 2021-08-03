import { History } from 'history';

import { PageNameType } from '../../../types';

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  pageName: PageNameType;
  history: History;
};

export type FeePrice = {
  nativeFio: number | null;
  costFio: number | null;
  costUsdc: number | null;
};

export type ContainerProps = {
  children?: React.ReactNode;
  feePrice: FeePrice;
  walletPublicKey: string;
  currentWallet: FioWalletDoublet;
  result: any;
  loading: boolean;
  transferProcessing: boolean;
  transferAddressValue: string;
  refreshBalance: (publicKey: string) => void;
  transfer: (params: TransferParams) => void;
  getFee: (isFioAddress: boolean) => void;
  getPrices: () => void;
  showPinModal: (action: string) => void;
  resetPinConfirm: () => void;
  pinConfirmation: PinConfirmation;
} & ContainerOwnProps;
