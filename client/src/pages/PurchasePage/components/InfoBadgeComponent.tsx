import React from 'react';

import InfoBadge from '../../../components/InfoBadge/InfoBadge';

import { BADGE_TYPES } from '../../../components/Badge/Badge';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../constants/purchase';
import { ERROR_MESSAGES, ERROR_TYPES } from '../../../constants/errors';

import { InfoBadgeComponentProps } from '../types';
import { CURRENCY_CODES } from '../../../constants/common';

import classes from '../styles/InfoBadgeComponent.module.scss';

const STRIPE_REQUIRES_PAYMENT_ERROR = 'requires_payment_method';

export const InfoBadgeComponent: React.FC<InfoBadgeComponentProps> = props => {
  const {
    paymentProvider,
    purchaseStatus,
    failedTxsTotalAmount = '',
    failedTxsTotalCurrency = '',
    failedMessage,
    hide,
    withoutTopMargin,
  } = props;

  let title = null;
  let message = null;
  let badgeUIType = null;

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
  }

  // Customize content info badge for Partial status
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS) {
    title = 'Incomplete Purchase!';
    badgeUIType = BADGE_TYPES.ERROR;

    // Custom message for FIO and non FIO providers
    if (paymentProvider === PAYMENT_PROVIDER.FIO || !failedTxsTotalAmount) {
      message =
        'There was an error during purchase of some items. No FIO Tokens were deducted from your wallet for the failed items. Go to your cart to try purchase again.';
    }

    if (paymentProvider === PAYMENT_PROVIDER.STRIPE && failedTxsTotalAmount) {
      if (
        !failedTxsTotalCurrency ||
        failedTxsTotalCurrency === CURRENCY_CODES.USDC
      )
        message = `There was an error during purchase of some items. As a result we have refunded $${failedTxsTotalAmount as string} back to your credit card. Go to your cart to try purchase again.`;

      if (failedTxsTotalCurrency === CURRENCY_CODES.FIO)
        message = `There was an error during purchase of some items. As a result we have credited ${failedTxsTotalAmount as string} FIO Tokens to your wallet. Go to your cart to try purchase using FIO Tokens instead.`;
    }
  }

  // Customize content info badge for Failed status
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.FAILED) {
    badgeUIType = BADGE_TYPES.ERROR;

    // Custom title and message for FIO provider
    if (paymentProvider === PAYMENT_PROVIDER.FIO) {
      title = 'Purchase failed!';
      message =
        ERROR_MESSAGES[failedMessage] || ERROR_MESSAGES[ERROR_TYPES.default];
    }

    // Custom title and message for crypto provider
    if (paymentProvider === PAYMENT_PROVIDER.CRYPTO) {
      title = 'Purchase Error';
      message = `There was an error during registration. As a result we could not confirm the purchase, but we have credited your wallet with ${failedTxsTotalAmount as string} FIO Tokens. You can use these tokens to register FIO Crypto Handle or Domain.`;
    }

    // Custom title and message for stripe provider
    if (paymentProvider === PAYMENT_PROVIDER.STRIPE) {
      // Custom title and message for default and requires_payment_method stripe errors
      if (failedMessage === STRIPE_REQUIRES_PAYMENT_ERROR) {
        title = 'Credit/Debit Card not accepted';
        message =
          'The credit card you have provided was not accepted by the issuing bank and therefore your transaction was not complete. Click close and try purchasing again with another form of payment.';
      } else {
        title = 'Purchase Error';

        if (
          !failedTxsTotalCurrency ||
          failedTxsTotalCurrency === CURRENCY_CODES.USDC
        )
          message = `There was an error during registration. As a result we have refunded the entire amount of order, $${failedTxsTotalAmount as string} back to your credit card. Click close and try purchasing again.`;

        if (failedTxsTotalCurrency === CURRENCY_CODES.FIO)
          message = `There was an error during registration. As a result we could not confirm the purchase, but we have credited your wallet with ${failedTxsTotalAmount as string} FIO Tokens. You can use these tokens to register FIO Crypto Handle or Domain.`;
      }
    }
  }

  return (
    <div className={withoutTopMargin && classes.withoutTopMargin}>
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
