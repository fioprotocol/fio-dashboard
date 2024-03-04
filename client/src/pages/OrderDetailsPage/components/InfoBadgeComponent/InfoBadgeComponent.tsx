import React from 'react';

import InfoBadge from '../../../../components/InfoBadge/InfoBadge';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
  PAYMENT_RESULTS_STATUS,
} from '../../../../constants/purchase';
import { ERROR_MESSAGES, ERROR_TYPES } from '../../../../constants/errors';

import { CURRENCY_CODES } from '../../../../constants/common';

import {
  OrderDetailedTotalCost,
  PaymentCurrency,
  PaymentProvider,
  PaymentStatus,
  PurchaseTxStatus,
} from '../../../../types';

import classes from './InfoBadgeComponent.module.scss';

const STRIPE_REQUIRES_PAYMENT_ERROR = 'requires_payment_method';
const DEFAULT_FAILED_MESSAGE = 'SINGED_TX_XTOKENS_REFUND_SKIP';

type Props = {
  isRetryAvailable?: boolean;
  paymentProvider: PaymentProvider;
  paymentStatus?: PaymentStatus;
  purchaseStatus: PurchaseTxStatus;
  failedTxsTotalAmount?: OrderDetailedTotalCost;
  failedTxsTotalCurrency?: PaymentCurrency;
  failedMessage?: string;
  hide?: boolean;
  withoutTopMargin?: boolean;
};

export const InfoBadgeComponent: React.FC<Props> = props => {
  const {
    isRetryAvailable,
    paymentProvider,
    paymentStatus,
    purchaseStatus,
    failedTxsTotalAmount,
    failedTxsTotalCurrency,
    failedMessage,
    hide,
    withoutTopMargin,
  } = props;

  let title = null;
  let message = null;
  let badgeUIType = null;

  const isFree = failedTxsTotalAmount?.freeTotalPrice;

  // Don't show info badge on success results
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.SUCCESS || hide) return null;

  // Customize content info badge for In Progress status
  if (
    purchaseStatus === PURCHASE_RESULTS_STATUS.PENDING ||
    purchaseStatus === PURCHASE_RESULTS_STATUS.PAYMENT_PENDING ||
    purchaseStatus === PURCHASE_RESULTS_STATUS.PAYMENT_AWAITING ||
    purchaseStatus === PURCHASE_RESULTS_STATUS.TRANSACTION_PENDING
  ) {
    title = 'Confirmation in Progress';
    badgeUIType = BADGE_TYPES.INFO;
    message =
      ' Your transaction is currently being confirmed. You do not need to remain on this screen and may close it without disrupting your purchase.';
  }

  // Customize content info badge for Canceled status
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.CANCELED) {
    title = 'Canceled Payment';
    badgeUIType = BADGE_TYPES.INFO;
    message = 'Your transaction has been cancelled.';

    if (paymentStatus === PAYMENT_RESULTS_STATUS.EXPIRED) {
      message =
        'Your transaction has been cancelled because your payment has been expired';
    }
  }

  // Customize content info badge for Partial status
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS) {
    title = 'Incomplete Purchase!';
    badgeUIType = BADGE_TYPES.ERROR;

    // Custom message for FIO and non FIO providers
    if (paymentProvider === PAYMENT_PROVIDER.FIO || !failedTxsTotalAmount) {
      message = `There was an error during purchase of some items. No FIO Tokens were deducted from your wallet for the failed items. ${
        isRetryAvailable
          ? 'Go to your cart to try purchase again.'
          : 'Click close and try purchase again.'
      }`;
    }

    if (paymentProvider === PAYMENT_PROVIDER.STRIPE && failedTxsTotalAmount) {
      if (
        !failedTxsTotalCurrency ||
        failedTxsTotalCurrency === CURRENCY_CODES.USDC ||
        failedTxsTotalCurrency.toUpperCase() === CURRENCY_CODES.USD
      )
        message = `There was an error during purchase of some items. As a result we have refunded ${
          failedTxsTotalAmount?.usdcTotalPrice
        } back to your credit card. ${
          isRetryAvailable
            ? 'Go to your cart to try purchase again.'
            : 'Click close and try purchase again.'
        }`;

      if (failedTxsTotalCurrency === CURRENCY_CODES.FIO)
        message = `There was an error during purchase of some items. As a result we have credited ${failedTxsTotalAmount?.fioTotalPrice} Tokens (${failedTxsTotalAmount?.usdcTotalPrice}) to your wallet. Go to your cart to try purchase using FIO Tokens instead.`;
    }

    if (paymentProvider === PAYMENT_PROVIDER.BITPAY) {
      message = `There was an error during purchase of some items. As a result we have refunded ${
        failedTxsTotalAmount?.usdcTotalPrice
      } back to your crypto wallet.  ${
        isRetryAvailable
          ? 'Go to your cart to try purchase again.'
          : 'Click close and try purchase again.'
      }`;

      if (failedTxsTotalCurrency === CURRENCY_CODES.FIO)
        message = `There was an error during purchase of some items. As a result we have credited ${failedTxsTotalAmount?.fioTotalPrice} Tokens (${failedTxsTotalAmount?.usdcTotalPrice}) to your wallet. Go to your cart to try purchase using FIO Tokens instead.`;
    }

    if (isFree) {
      message =
        'There was an error during purchase of some items. Click close and try again.';
    }
  }

  // Customize content info badge for Failed status
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.FAILED) {
    title = 'Purchase Error';
    badgeUIType = BADGE_TYPES.ERROR;

    // Custom title and message for FIO provider
    if (paymentProvider === PAYMENT_PROVIDER.FIO) {
      if (isRetryAvailable && failedMessage === DEFAULT_FAILED_MESSAGE) {
        message = ERROR_MESSAGES[ERROR_TYPES.hasRetry];
      } else {
        message =
          ERROR_MESSAGES[failedMessage] || ERROR_MESSAGES[ERROR_TYPES.default];
      }
    }

    // Custom title and message for crypto provider
    if (paymentProvider === PAYMENT_PROVIDER.BITPAY) {
      if (failedTxsTotalCurrency === CURRENCY_CODES.FIO) {
        message = `There was an error during registration. As a result we could not confirm the purchase, but we have credited your wallet with ${failedTxsTotalAmount.fioTotalPrice} Tokens. You can use these tokens to register FIO Handle or Domain.`;
      } else {
        message = `There was an error during purchase. As a result we have refunded the entire amount of order, ${failedTxsTotalAmount?.usdcTotalPrice} back to your crypto wallet. Click close and try purchase again.`;
      }
    }

    // Custom title and message for stripe provider
    if (paymentProvider === PAYMENT_PROVIDER.STRIPE) {
      // Custom title and message for default and requires_payment_method stripe errors
      if (failedMessage === STRIPE_REQUIRES_PAYMENT_ERROR) {
        title = 'Payment Error';
        message =
          'The payment was not accepted and as a result the transaction was not processed.';
      } else {
        if (failedTxsTotalCurrency === CURRENCY_CODES.FIO) {
          message = `There was an error during registration. As a result we could not confirm the purchase, but we have credited your wallet with ${failedTxsTotalAmount?.fioTotalPrice} Tokens (${failedTxsTotalAmount?.usdcTotalPrice}). You can use these tokens to register FIO Handle or Domain.`;
        } else {
          message = `There was an error during purchase. As a result we have refunded the entire amount of order, ${failedTxsTotalAmount?.usdcTotalPrice} back to your credit card. Click close and try purchase again.`;
        }
      }
    }

    // Custom message for FREE fch
    if (isFree) {
      message =
        ERROR_MESSAGES[failedMessage] ||
        ERROR_MESSAGES[ERROR_TYPES.freeAddressError];
    }
  }

  return (
    <div className={withoutTopMargin ? classes.withoutTopMargin : undefined}>
      <InfoBadge
        title={title}
        message={message}
        show={!!title && !!message && !!badgeUIType}
        type={badgeUIType}
      />
      <br />
    </div>
  );
};
