import {
  CartItem,
  CartItemType,
  FioWalletDoublet,
  Prices,
  RefProfile,
  RegistrationResult,
} from '../../types';

export type PurchaseValues = {
  cartItems: CartItem[];
  prices: Prices;
  refProfileInfo: RefProfile | null;
};

export type PurchaseNowTypes = {
  disabled?: boolean;
  onFinish: (results: RegistrationResult) => void;
};

export type RegistrationType = {
  action: string;
  cartItemId: string;
  fioName: string;
  isFree: boolean;
  isCombo?: boolean;
  isCustomDomain?: boolean;
  fee: number;
  fee_collected?: number;
  type: CartItemType;
  iteration?: number;
  signInFioWallet?: FioWalletDoublet;
};

export type GroupedPurchaseValues = {
  signInFioWallet: FioWalletDoublet;
  submitData: PurchaseValues;
};
