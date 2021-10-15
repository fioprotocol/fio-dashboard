import {
  CartItem,
  FioWalletDoublet,
  PinConfirmation,
  Prices,
  RefProfile,
} from '../../types';

export type PurchaseNowTypes = {
  cartItems: CartItem[];
  pinConfirmation: PinConfirmation;
  captchaResult: { success: boolean; verifyParams: {} };
  paymentWalletPublicKey: string;
  showPinModal: (action: string) => void;
  checkCaptcha: () => void;
  loadProfile: () => void;
  confirmingPin: boolean;
  captchaResolving: boolean;
  isProcessing: boolean;
  onFinish: () => void;
  setProcessing: (flag: boolean) => void;
  resetPinConfirm: () => void;
  isRetry: boolean;
  fioWallets: FioWalletDoublet[];
  prices: Prices;
  refProfileInfo: RefProfile | null;
};

export type RegistrationType = {
  cartItemId: string;
  fioName: string;
  isFree: boolean;
  fee: number;
  isCustomDomain?: boolean;
  depended?: { domain: string };
  fee_collected?: number;
};
