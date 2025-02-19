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
  Roe,
} from '../../types';
import { SignedTxArgs } from '../../api/fio';
import { GroupedCartItemsByPaymentWallet } from '../../util/cart';
import { GroupedBeforeSubmitValues } from './components/BeforeSubmitWalletConfirm';

export type PayWith = GroupedCartItemsByPaymentWallet<CartItem> & {
  notEnoughFio: boolean;
  totalCostNativeFio: string;
  available: WalletBalancesItem;
};

type DefaultProps = {
  walletBalances: WalletBalancesItem;
  paymentWallet?: FioWalletDoublet;
  fioWallets: FioWalletDoublet[];
  paymentAssignmentWallets: FioWalletDoublet[];
  paymentWalletPublicKey: string;
  payWith: PayWith[];
  fioWalletsBalances: WalletsBalances;
  order: Order;
  payment: Payment;
  paymentProviderError: ApiError;
  paymentOption: PaymentOptionsProps;
  paymentProvider: PaymentProvider;
  isFree: boolean;
  isNoProfileFlow: boolean;
  hasPublicCartItems: boolean;
  setWallet: (publicKey: string) => void;
  beforePaymentSubmit: (handleSubmit: () => Promise<void>) => Promise<void>;
  onFinish: (results: RegistrationResult) => void;
  displayOrderItems: CartItemType[];
};

export type CheckoutComponentProps = {
  roe: Roe;
} & DefaultProps;

export type PaymentOptionComponentProps = {
  costFree?: string | null;
  totalCost: string;
} & DefaultProps;

export type StripePaymentOptionProps = {
  paymentOption: PaymentOptionsProps;
  totalCost: string;
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
  displayOrderItem: CartItem;
};

export type BeforeSubmitValues = {
  fioAddressItems: SignFioAddressItem[];
};

export type BeforeSubmitState = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: BeforeSubmitData) => void;
  onCancel: () => void;
  submitData: BeforeSubmitValues | null;
  fee?: string | null;
  groupedBeforeSubmitValues?: GroupedBeforeSubmitValues[];
};

export type BeforeSubmitProps = {
  setProcessing: (processing: boolean) => void;
  processing: boolean;
} & BeforeSubmitState;

export type BitPayOptionProps = {
  paymentOption: PaymentOptionsProps;
  totalCost: string;
} & DefaultProps;
