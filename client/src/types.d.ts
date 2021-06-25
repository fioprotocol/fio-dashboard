export type Domain = { domain: string; free?: boolean };

export type CartItem = {
  address?: string;
  domain: string;
  id: string;
  costFio?: number;
  costUsdc?: number;
  hasCustomDomain?: boolean;
  allowFree?: boolean;
  showBadge?: boolean;
  error?: any;
  isFree?: boolean;
};

export type Prices = {
  fio: { address: number; domain: number };
  fioNative: { address: number; domain: number };
  usdt: { address: number; domain: number };
};

export type RegistrationResult = {
  errors: any[];
  registered: any[];
  partial: any[];
};

export type FioWallets = any[];

export type DeleteCartItem = {
  id?: string;
  cartItems?: CartItem[];
};
