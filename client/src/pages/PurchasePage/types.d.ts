import { PAYMENT_PROVIDER } from '../../constants/purchase';
import { CURRENCY_CODES } from '../../../constants/common';

import { CartItem, PurchaseTxStatus } from '../../types';
import { FioWalletDoublet } from '../../types';

type PurchaseProvider = typeof PAYMENT_PROVIDER[keyof typeof PAYMENT_PROVIDER];

type PaymentCurrency = typeof CURRENCY_CODES[keyof typeof CURRENCY_CODES];

export type ErrBadgesProps = {
  [badgeKey: string]: {
    total: string;
    totalCurrency: string;
    errorType: string;
    items: CartItem[];
  };
};

type CommonResultsProps = {
  paymentWallet: FioWalletDoublet;
  paymentProvider: PurchaseProvider;
  txItems: CartItem[];
  paymentAmount: number | string;
  paymentCurrency: PaymentCurrency;
  convertedPaymentAmount?: number | string;
  convertedPaymentCurrency?: PaymentCurrency;
  costFree?: string;
  providerTxId?: number | string;
};

export type RegisteredResultsComponentProps = {
  purchaseStatus: PurchaseTxStatus;
} & CommonResultsProps;

export type FailedResultsComponentProps = {
  allErrored: boolean;
  errorBadges?: ErrBadgesProps;
  failedTxsTotalAmount: number | string;
} & RegisteredResultsComponentProps;

export type PurchaseResultsProps = {
  priceUIType?: string;
  priceTitle?: string;
  failedPayment?: boolean;
  hidePayWithBadge?: boolean;
} & CommonResultsProps;

export type InfoBadgeComponentProps = {
  paymentProvider: PurchaseProvider;
  purchaseStatus: PurchaseTxStatus;
  failedTxsTotalAmount?: number | string;
  failedTxsTotalCurrency?: string;
  failedMessage?: string;
  hide?: boolean;
  withoutTopMargin?: boolean;
};
