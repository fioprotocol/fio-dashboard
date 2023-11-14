import {
  CartItem,
  CartItemType,
  FioWalletDoublet,
  Prices,
  RefProfile,
} from '../../types';

export type PurchaseValues = {
  cartItems: CartItem[];
  prices: Prices;
  refProfileInfo: RefProfile | null;
};

export type PurchaseNowTypes = {
  hasFreeAddress: boolean;
  cartItems: CartItem[];
  captchaResult: { success: boolean; verifyParams: {} };
  paymentWalletPublicKey: string;
  checkCaptcha: () => void;
  captchaResolving: boolean;
  isProcessing: boolean;
  onFinish: () => void;
  setProcessing: (isProcessing: boolean) => void;
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
