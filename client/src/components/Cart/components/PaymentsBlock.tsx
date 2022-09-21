import React from 'react';

import { PaymentOptions } from '../../PaymentOptions';

import OtherPaymentsBlock from './OtherPaymentsBlock';

import { PAYMENT_OPTIONS } from '../../../constants/purchase';

import { CartItem, FioWalletDoublet, PaymentProvider } from '../../../types';

type Props = {
  isFree?: boolean;
  onPaymentChoose: (paymentProvider: PaymentProvider) => void;
  hasLowBalance?: boolean;
  paymentWalletPublicKey?: string;
  cartItems?: CartItem[];
  totalCartNativeAmount: number;
  userWallets: FioWalletDoublet[];
  checkoutApproving: PaymentProvider;
  disabled?: boolean;
};

const PaymentsBlock: React.FC<Props> = props => {
  const {
    isFree,
    hasLowBalance,
    cartItems,
    paymentWalletPublicKey,
    totalCartNativeAmount,
    userWallets,
    checkoutApproving,
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
    checkoutApproving,
    disabled,
    onPaymentChoose,
  };

  const otherPaymentsProps = {
    paymentOptionsList: [PAYMENT_OPTIONS.CREDIT_CARD, PAYMENT_OPTIONS.CRYPTO],
    cartItems,
    checkoutApproving,
    disabled,
    onPaymentChoose,
  };

  return (
    <>
      <PaymentOptions {...paymentFioProps} />
      <OtherPaymentsBlock
        defaultShowState={hasLowBalance}
        optionsDisabled={cartItems.length === 0 || isFree}
        {...otherPaymentsProps}
      />
    </>
  );
};

export default PaymentsBlock;
