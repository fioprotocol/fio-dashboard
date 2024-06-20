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
  totalCartNativeAmount: number;
  totlaCartUsdcAmount: string;
  userWallets: FioWalletDoublet[];
  selectedPaymentProvider: PaymentProvider;
  showExpiredDomainWarningBadge: boolean;
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
    totlaCartUsdcAmount,
    userWallets,
    selectedPaymentProvider,
    disabled,
    showExpiredDomainWarningBadge,
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
    totlaCartUsdcAmount,
    disabled,
    formsOfPayment,
    onPaymentChoose,
  };

  const priceIsLowerThanHalfADollar = new MathOp(totlaCartUsdcAmount).lt(0.7);
  const priceIsLowerThanOneDollar = new MathOp(totlaCartUsdcAmount).lt(1);

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
          (isAffiliateEnabled && !formsOfPayment?.stripeAffiliate)) &&
        formsOfPayment?.bitpay) ||
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

    const beginingOfTheMessage =
      stripeMessagePart || cryptoMessagePart
        ? 'Your cart needs to be at least'
        : 'You need to deposit FIO Tokens.';

    const endOfTheMessage =
      stripeMessagePart || cryptoMessagePart
        ? 'or you need to deposit FIO Tokens.'
        : '';
    return (
      <NotificationBadge
        message={`${beginingOfTheMessage} ${stripeMessagePart} ${cryptoMessagePart} ${endOfTheMessage}`}
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
