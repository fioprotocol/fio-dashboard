import {
  CartItem as CartItemType,
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
  RegistrationResult,
  PaymentOptionsProps,
  Payment,
} from '../../types';

type DefaultProps = {
  walletBalances: WalletBalancesItem;
  walletName: string;
  fioWallets: FioWalletDoublet[];
  paymentWalletPublicKey: string;
  fioWalletsBalances: WalletsBalances;
  paymentOption: PaymentOptionsProps;
  isFree: boolean;
  setWallet: (publicKey: string) => void;
  onFinish: (results: RegistrationResult) => void;
  cart: CartItemType[];
  payment: Payment;
  paymentOptionError: {
    code: string;
  } | null;
};

export type CheckoutComponentProps = {
  roe: number | null;
} & DefaultProps;

export type PaymentOptionComponentProps = {
  costFree?: string | null;
} & DefaultProps;

export type StripePaymentOptionProps = {
  paymentOption: PaymentOptionsProps;
} & DefaultProps;
