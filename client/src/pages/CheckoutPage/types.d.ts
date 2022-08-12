import {
  CartItem as CartItemType,
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
  RegistrationResult,
  PaymentOptionsProps,
  Payment,
  ApiError,
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
  beforePaymentSubmit: (handleSubmit: () => Promise<void>) => Promise<void>;
  onFinish: (results: RegistrationResult) => void;
  cart: CartItemType[];
  payment: Payment;
  paymentOptionError: ApiError;
};

export type CheckoutComponentProps = {
  roe: number | null;
} & DefaultProps;

export type PaymentOptionComponentProps = {
  costFree?: string | null;
  totalCost: number;
} & DefaultProps;

export type StripePaymentOptionProps = {
  paymentOption: PaymentOptionsProps;
} & DefaultProps;

export type BeforeSubmitData = { [fioAddress: string]: any }; // todo: set proper type for tx

export type BeforeSubmitProps = {
  walletConfirmType: string;
  onSuccess: (data: BeforeSubmitData) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  data: {
    fioAddressItems: { fioWallet: FioWalletDoublet; name: string }[];
  } | null;
  processing: boolean;
  fee?: number | null;
};
