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
  error?: string;
  isFree?: boolean;
};

export type Prices = {
  fio: { address: number; domain: number };
  fioNative: { address: number; domain: number };
  usdt: { address: number; domain: number };
};

export type RegistrationResult = {
  errors: {
    fioName: string;
    error: string;
    isFree?: boolean;
    cartItemId: string;
  }[];
  registered: {
    fioName: string;
    isFree?: boolean;
    fee_collected: number;
    cartItemId: string;
  }[];
  partial: string[];
};

export type DeleteCartItem =
  | {
      id?: string;
      cartItems?: CartItem[];
    }
  | string;

export type FioWalletDoublet = {
  id: string;
  name: string;
  publicKey: string;
  balance?: number | null;
};

export type WalletKeysObj = {
  [walletId: string]: {
    private: string;
    public: string;
  };
};
