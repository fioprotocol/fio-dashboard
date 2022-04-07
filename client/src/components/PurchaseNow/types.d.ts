import {
  CartItem,
  FioWalletDoublet,
  PinConfirmation,
  Prices,
  RefProfile,
  User,
} from '../../types';

export type PurchaseNowTypes = {
  user: User;
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
  setProcessing: (isProcessing: boolean) => void;
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
