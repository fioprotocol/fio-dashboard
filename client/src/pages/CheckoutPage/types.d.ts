import {
  CartItem as CartItemType,
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
  RegistrationResult,
  Order,
  PaymentOptionsProps,
  Payment,
  ApiError,
  PaymentProvider,
  CartItem,
} from '../../types';
import { SignedTxArgs } from '../../api/fio';

type DefaultProps = {
  walletBalances: WalletBalancesItem;
  paymentWallet?: FioWalletDoublet;
  fioWallets: FioWalletDoublet[];
  paymentAssignmentWallets: FioWalletDoublet[];
  paymentWalletPublicKey: string;
  fioWalletsBalances: WalletsBalances;
  order: Order;
  payment: Payment;
  paymentProviderError: ApiError;
  paymentOption: PaymentOptionsProps;
  paymentProvider: PaymentProvider;
  isFree: boolean;
  setWallet: (publicKey: string) => void;
  beforePaymentSubmit: (handleSubmit: () => Promise<void>) => Promise<void>;
  onFinish: (results: RegistrationResult) => void;
  cart: CartItemType[];
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
  totalCost: number;
} & DefaultProps;

export type BeforeSubmitData = Record<
  string,
  {
    signedTx?: SignedTxArgs;
    signingWalletPubKey?: string;
  }
>;

export type SignFioAddressItem = {
  fioWallet: FioWalletDoublet;
  name: string;
  ownerKey: string;
  cartItem: CartItem;
};

export type BeforeSubmitValues = {
  fioAddressItems: SignFioAddressItem[];
};

export type BeforeSubmitState = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: BeforeSubmitData) => void;
  onCancel: () => void;
  submitData: BeforeSubmitValues | null;
  fee?: number | null;
};

export type BeforeSubmitProps = {
  setProcessing: (processing: boolean) => void;
  processing: boolean;
} & BeforeSubmitState;

export type BitPayOptionProps = {
  paymentOption: PaymentOptionsProps;
  totalCost: number;
} & DefaultProps;
