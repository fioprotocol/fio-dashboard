import React from 'react';

import { PaymentOptions } from '../../PaymentOptions';
import NotificationBadge from '../../NotificationBadge';
import { BADGE_TYPES } from '../../Badge/Badge';

import OtherPaymentsBlock from './OtherPaymentsBlock';

import { PAYMENT_OPTIONS } from '../../../constants/purchase';
import { WARNING_CONTENT } from '../../../pages/FioAddressManagePage/constants';

import MathOp from '../../../util/math';

import { CartItem, FioWalletDoublet, PaymentProvider } from '../../../types';

type Props = {
  isAffiliateEnabled?: boolean;
  isFree?: boolean;
  onPaymentChoose: (paymentProvider: PaymentProvider) => void;
  hasLowBalance?: boolean;
  paymentWalletPublicKey?: string;
  cartItems?: CartItem[];
  totalCartNativeAmount: string;
  totalCartUsdcAmount: string;
  userWallets: FioWalletDoublet[];
  selectedPaymentProvider: PaymentProvider;
  showExpiredDomainWarningBadge: boolean;
  showTooLongDomainRenewalWarning: boolean;
  disabled?: boolean;
  loading: boolean;
  formsOfPayment: { [key: string]: boolean };
};

const PaymentsBlock: React.FC<Props> = props => {
  const {
    isAffiliateEnabled,
    isFree,
    hasLowBalance,
    cartItems,
    paymentWalletPublicKey,
    totalCartNativeAmount,
    totalCartUsdcAmount,
    userWallets,
    selectedPaymentProvider,
    disabled,
    showExpiredDomainWarningBadge,
    showTooLongDomainRenewalWarning,
    loading,
    formsOfPayment,
    onPaymentChoose,
  } = props;

  const paymentFioProps = {
    paymentOptionsList: [PAYMENT_OPTIONS.FIO],
    isFree,
    hasLowBalance,
    paymentWalletPublicKey,
    cartItems,
    totalCartNativeAmount,
    userWallets,
    selectedPaymentProvider,
    disabled,
    onPaymentChoose,
  };

  const otherPaymentsProps = {
    isAffiliateEnabled,
    paymentOptionsList: [PAYMENT_OPTIONS.CREDIT_CARD, PAYMENT_OPTIONS.CRYPTO],
    cartItems,
    selectedPaymentProvider,
    totalCartUsdcAmount,
    disabled,
    formsOfPayment,
    onPaymentChoose,
  };

  let priceIsLowerThanHalfADollar = true;
  let priceIsLowerThanOneDollar = true;
  try {
    priceIsLowerThanHalfADollar = new MathOp(totalCartUsdcAmount).lt(0.5);
    priceIsLowerThanOneDollar = new MathOp(totalCartUsdcAmount).lt(1);
  } catch (err) {
    //
  }

  if (showExpiredDomainWarningBadge) {
    return (
      <NotificationBadge
        show
        message={WARNING_CONTENT.EXPIRED_DOMAINS.message}
        title={WARNING_CONTENT.EXPIRED_DOMAINS.title}
        type={BADGE_TYPES.WARNING}
      />
    );
  }

  if (showTooLongDomainRenewalWarning) {
    return (
      <NotificationBadge
        show
        message={WARNING_CONTENT.TOO_LONG_DOMAIN_RENEWAL.message}
        title={WARNING_CONTENT.TOO_LONG_DOMAIN_RENEWAL.title}
        type={BADGE_TYPES.WARNING}
      />
    );
  }

  if (
    hasLowBalance &&
    !isFree &&
    !loading &&
    cartItems.length &&
    ((priceIsLowerThanHalfADollar &&
      (formsOfPayment?.stripe ||
        formsOfPayment?.bitpay ||
        formsOfPayment?.stripeAffiliate)) ||
      (priceIsLowerThanOneDollar &&
        (!formsOfPayment?.stripe ||
          (isAffiliateEnabled &&
            !formsOfPayment?.stripeAffiliate &&
            formsOfPayment?.bitpay))) ||
      (!formsOfPayment?.stripe && !formsOfPayment?.bitpay))
  ) {
    const stripeMessagePart =
      ((!isAffiliateEnabled && formsOfPayment?.stripe) ||
        (isAffiliateEnabled && formsOfPayment?.stripeAffiliate)) &&
      priceIsLowerThanHalfADollar
        ? '$0.50 to pay with credit card,'
        : '';
    const cryptoMessagePart =
      formsOfPayment?.bitpay &&
      (priceIsLowerThanHalfADollar || priceIsLowerThanOneDollar)
        ? '$1.00 to pay with crypto,'
        : '';

    const beginningOfTheMessage =
      stripeMessagePart || cryptoMessagePart
        ? 'Your cart needs to be at least'
        : 'You need to deposit FIO Tokens.';

    const endOfTheMessage =
      stripeMessagePart || cryptoMessagePart
        ? 'or you need to deposit FIO Tokens.'
        : '';
    return (
      <NotificationBadge
        message={`${beginningOfTheMessage} ${stripeMessagePart} ${cryptoMessagePart} ${endOfTheMessage}`}
        show
        title="Minimum cart total not met"
        type={BADGE_TYPES.ERROR}
      />
    );
  }

  if (
    hasLowBalance &&
    formsOfPayment &&
    (!formsOfPayment.stripe ||
      (formsOfPayment.stripe &&
        isAffiliateEnabled &&
        !formsOfPayment.stripeAffiliate)) &&
    !formsOfPayment.bitpay &&
    !isFree &&
    !loading &&
    cartItems.length
  ) {
    return (
      <NotificationBadge
        message="FIO Tokens low balance. You need to deposit FIO Tokens."
        show
        title="Not enough funds."
        type={BADGE_TYPES.ERROR}
      />
    );
  }

  return (
    <>
      <PaymentOptions {...paymentFioProps} />
      <OtherPaymentsBlock
        defaultShowState={hasLowBalance}
        optionsDisabled={
          cartItems.length === 0 ||
          isFree ||
          (formsOfPayment &&
            (!formsOfPayment.stripe ||
              (formsOfPayment.stripe &&
                isAffiliateEnabled &&
                !formsOfPayment.stripeAffiliate) ||
              ((formsOfPayment.stripe || formsOfPayment.stripeAffiliate) &&
                priceIsLowerThanHalfADollar)) &&
            (!formsOfPayment.bitpay ||
              (formsOfPayment.bitpay && priceIsLowerThanOneDollar)))
        }
        {...otherPaymentsProps}
      />
    </>
  );
};

export default PaymentsBlock;
