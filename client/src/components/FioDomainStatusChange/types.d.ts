import { History } from 'history';

import {
  FioWalletDoublet,
  FioNameItemProps,
  DomainStatusType,
  PinConfirmation,
  FeePrice,
} from '../../types';

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  history: History;
};

export type ContainerProps = {
  children?: React.ReactNode;
  domainStatus: DomainStatusType;
  feePrice: FeePrice;
  walletPublicKey: string;
  currentWallet: FioWalletDoublet;
  result: { feeCollected?: FeePrice; error?: string };
  loading: boolean;
  setVisibilityProcessing: boolean;
  refreshBalance: (publicKey: string) => void;
  setDomainVisibility: (params: {
    fioDomain: string;
    isPublic: boolean;
    fee: number;
    keys: { public: string; private: string };
  }) => void;
  getFee: () => void;
  getPrices: () => void;
  showPinModal: (action: string) => void;
  resetPinConfirm: () => void;
  pinConfirmation: PinConfirmation;
} & ContainerOwnProps;
