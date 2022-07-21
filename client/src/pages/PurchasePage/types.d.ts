import { PURCHASE_PROVIDER } from '../../constants/purchase';
import { CURRENCY_CODES } from '../../../constants/common';

import { CartItem, PurchaseTxStatus } from '../../../types';

type PurchaseProvider = typeof PURCHASE_PROVIDER[keyof typeof PURCHASE_PROVIDER];

type PaymentCurrency = typeof CURRENCY_CODES[keyof typeof CURRENCY_CODES];

type CommonResultsProps = {
  purchaseProvider: PurchaseProvider;
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
  failedTxsTotalAmount: number | string;
} & RegisteredResultsComponentProps;

export type PurchaseResultsProps = {
  priceUIType?: string;
  priceTitle?: string;
  failedPayment?: boolean;
  hidePayWithBadge?: boolean;
} & CommonResultsProps;

export type InfoBadgeCmoponentProps = {
  purchaseProvider: PurchaseProvider;
  purchaseStatus: PurchaseTxStatus;
  failedTxsTotalAmount?: number | string;
  failedMessage?: string;
};
