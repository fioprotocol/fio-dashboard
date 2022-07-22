import React from 'react';

import { BADGE_TYPES } from '../../../components/Badge/Badge';
import InfoBadge from '../../../components/InfoBadge/InfoBadge';

import {
  PURCHASE_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../constants/purchase';

import { ERROR_MESSAGES, ERROR_TYPES } from '../../../constants/errors';

import { InfoBadgeComponentProps } from '../types';

const STRIPE_REQUIRES_PAYMENT_ERROR = 'requires_payment_method';

export const InfoBadgeComponent: React.FC<InfoBadgeComponentProps> = props => {
  const {
    purchaseProvider,
    purchaseStatus,
    failedTxsTotalAmount = '',
    failedMessage,
  } = props;

  let title = null;
  let message = null;
  let badgeUIType = null;

  // Don't show info badge on success results
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.DONE) return null;

  // Customize content info badge for In Progress status
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.PENDING) {
    title = 'Confirmation in Progress';
    badgeUIType = BADGE_TYPES.INFO;

    // Custom message for crypto provider
    if (purchaseProvider === PURCHASE_PROVIDER.CRYPTO) {
      message =
        'Your crypto payment is currently being confirmed. You do not need to remain on this screen and may close the view without disrupting your purchase.';
    }

    // Custom message for stripe provider
    if (purchaseProvider === PURCHASE_PROVIDER.STRIPE) {
      message =
        'Your credit/debit card payment is currently being confirmed. You do not need to remain on this screen and may close the view without disrupting your purchase.';
    }
  }

  // Customize content info badge for Canceled status
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.CANCELED) {
    title = 'Canceled Payment';
    badgeUIType = BADGE_TYPES.INFO;

    // Custom message for crypto provider
    if (purchaseProvider === PURCHASE_PROVIDER.CRYPTO) {
      message = 'Your crypto payment has been cancelled.';
    }

    // Custom message for stripe provider
    if (purchaseProvider === PURCHASE_PROVIDER.STRIPE) {
      message = 'Your credit/debit card payment has been cancelled.';
    }
  }

  // Customize content info badge for Partial status
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS) {
    title = 'Incomplete Purchase!';
    badgeUIType = BADGE_TYPES.ERROR;

    // Custom message for FIO and non FIO providers
    if (purchaseProvider === PURCHASE_PROVIDER.FIO) {
      message =
        'Your purchase was not completed in full. Please see below what failed to be completed.';
    } else {
      message = `The following items failed to purchase. We have credited your account with ${failedTxsTotalAmount as string} FIO Tokens which represents the value of those items. Please go back and try your purchase again.`;
    }
  }

  // Customize content info badge for Failed status
  if (purchaseStatus === PURCHASE_RESULTS_STATUS.FAILED) {
    badgeUIType = BADGE_TYPES.ERROR;

    // Custom title and message for FIO provider
    if (purchaseProvider === PURCHASE_PROVIDER.FIO) {
      title = 'Purchase failed!';
      message =
        ERROR_MESSAGES[failedMessage] || ERROR_MESSAGES[ERROR_TYPES.default];
    }

    // Custom title and message for crypto provider
    if (purchaseProvider === PURCHASE_PROVIDER.CRYPTO) {
      title = 'Purchase Error';
      message = `There was an error during registration. As a result we could not confirm the purchase, but we have credited your wallet with ${failedTxsTotalAmount as string} FIO Tokens. You can use these tokens to register FIO Crypto Handle or Domain.`;
    }

    // Custom title and message for stripe provider
    if (purchaseProvider === PURCHASE_PROVIDER.STRIPE) {
      // Custom title and message for default and requires_payment_method stripe errors
      if (failedMessage === STRIPE_REQUIRES_PAYMENT_ERROR) {
        title = 'Credit/Debit Card not accepted';
        message =
          'The credit card you have provided was not accepted by the issuing bank and therefore your transaction was not complete. Click close and try purchasing again with another form of payment.';
      } else {
        title = 'Purchase Error';
        message = `There was an error during registration. As a result we have refunded the entire amount of order, $${failedTxsTotalAmount as string} back to your credit card. Click close and try purchasing again.`;
      }
    }
  }

  return (
    <InfoBadge
      title={title}
      message={message}
      show={!!title && !!message && !!badgeUIType}
      type={badgeUIType}
    />
  );
};
