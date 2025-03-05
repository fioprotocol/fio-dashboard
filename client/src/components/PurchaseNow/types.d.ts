import {
  CartItem,
  CartItemType,
  FioWalletDoublet,
  Prices,
  RefProfile,
  RegistrationResult,
} from '../../types';

export type PurchaseValues = {
  displayOrderItems: CartItem[];
  prices: Prices;
  refProfileInfo: RefProfile | null;
};

export type PurchaseNowTypes = {
  displayOrderItems: CartItem[];
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
  fee: string;
  fee_collected?: number;
  type: CartItemType;
  iteration?: number;
  signInFioWallet?: FioWalletDoublet;
};

export type GroupedPurchaseValues = {
  signInFioWallet: FioWalletDoublet;
  submitData: PurchaseValues;
};
