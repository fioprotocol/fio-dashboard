import {
  CartItem,
  CartItemType,
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
