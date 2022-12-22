import {
  CartItem,
  CartItemType,
  FioWalletDoublet,
  PinConfirmation,
  Prices,
  RefProfile,
} from '../../types';

export type PurchaseValues = {
  cartItems: CartItem[];
  prices: Prices;
  refProfileInfo: RefProfile | null;
  isFreeAllowed: boolean;
};

export type PurchaseNowTypes = {
  hasFreeAddress: boolean;
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
  fioWallets: FioWalletDoublet[];
  prices: Prices;
  refProfileInfo: RefProfile | null;
  disabled?: boolean;
};

export type RegistrationType = {
  cartItemId: string;
  fioName: string;
  isFree: boolean;
  fee: number;
  isCustomDomain?: boolean;
  depended?: { domain: string };
  fee_collected?: number;
  type: CartItemType;
  iteration?: number;
};
