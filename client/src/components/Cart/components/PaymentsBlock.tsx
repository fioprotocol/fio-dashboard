import React from 'react';

import { PaymentOptions } from '../../PaymentOptions';
import NotificationBadge from '../../NotificationBadge';
import { BADGE_TYPES } from '../../Badge/Badge';

import OtherPaymentsBlock from './OtherPaymentsBlock';

import { PAYMENT_OPTIONS } from '../../../constants/purchase';

import MathOp from '../../../util/math';

import { CartItem, FioWalletDoublet, PaymentProvider } from '../../../types';

type Props = {
  isFree?: boolean;
  onPaymentChoose: (paymentProvider: PaymentProvider) => void;
  hasLowBalance?: boolean;
  paymentWalletPublicKey?: string;
  cartItems?: CartItem[];
  totalCartNativeAmount: number;
  totlaCartUsdcAmount: string;
  userWallets: FioWalletDoublet[];
  selectedPaymentProvider: PaymentProvider;
  disabled?: boolean;
};

const PaymentsBlock: React.FC<Props> = props => {
  const {
    isFree,
    hasLowBalance,
    cartItems,
    paymentWalletPublicKey,
    totalCartNativeAmount,
    totlaCartUsdcAmount,
    userWallets,
    selectedPaymentProvider,
    disabled,
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
    paymentOptionsList: [PAYMENT_OPTIONS.CREDIT_CARD, PAYMENT_OPTIONS.CRYPTO],
    cartItems,
    selectedPaymentProvider,
    totlaCartUsdcAmount,
    disabled,
    onPaymentChoose,
  };

  const priceIsLowerThanHalfADollar = new MathOp(totlaCartUsdcAmount).lt(0.5);

  if (hasLowBalance && priceIsLowerThanHalfADollar) {
    return (
      <NotificationBadge
        message="Your cart needs to be at least $0.50 to pay with credit card, $1.00 to pay with crypto, or you need to deposit FIO Tokens."
        show
        title="Minimum cart total not met"
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
          cartItems.length === 0 || isFree || priceIsLowerThanHalfADollar
        }
        {...otherPaymentsProps}
      />
    </>
  );
};

export default PaymentsBlock;
