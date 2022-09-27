import {
  CartItem as CartItemType,
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
  RegistrationResult,
  PaymentOptionsProps,
  Payment,
  ApiError,
  PaymentProvider,
} from '../../types';
import { SignedTxArgs } from '../../api/fio';

type DefaultProps = {
  walletBalances: WalletBalancesItem;
  walletName: string;
  fioWallets: FioWalletDoublet[];
  paymentAssignmentWallets: FioWalletDoublet[];
  paymentWalletPublicKey: string;
  fioWalletsBalances: WalletsBalances;
  payment: Payment;
  paymentProviderError: ApiError;
  paymentOption: PaymentOptionsProps;
  paymentProvider: PaymentProvider;
  isFree: boolean;
  setWallet: (publicKey: string) => void;
  beforePaymentSubmit: (handleSubmit: () => Promise<void>) => Promise<void>;
  onFinish: (results: RegistrationResult) => void;
  cart: CartItemType[];
  error?: string | null;
  submitDisabled?: boolean;
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

export type BeforeSubmitData = {
  [fioAddress: string]: {
    signedTx?: SignedTxArgs;
    signingWalletPubKey?: string;
  };
};

export type SignFioAddressItem = {
  fioWallet: FioWalletDoublet;
  name: string;
  ownerKey: string;
};

export type BeforeSubmitState = {
  walletConfirmType: string;
  onSuccess: (data: BeforeSubmitData) => void;
  onCancel: () => void;
  data: {
    fioAddressItems: SignFioAddressItem[];
  } | null;
  fee?: number | null;
};

export type BeforeSubmitProps = {
  setProcessing: (processing: boolean) => void;
  processing: boolean;
} & BeforeSubmitState;
