import React from 'react';

import { PaymentOptions } from '../../PaymentOptions';

import OtherPaymentsBlock from './OtherPaymentsBlock';

import { PAYMENT_OPTIONS } from '../../../constants/purchase';

import {
  CartItem,
  FioWalletDoublet,
  PaymentOptionsProps,
} from '../../../types';

type Props = {
  isFree?: boolean;
  onPaymentChoose: (paymentOption: PaymentOptionsProps) => void;
  hasLowBalance?: boolean;
  paymentWalletPublicKey?: string;
  cartItems?: CartItem[];
  totalCartNativeAmount: number;
  userWallets: FioWalletDoublet[];
};

const PaymentsBlock: React.FC<Props> = props => {
  const {
    isFree,
    hasLowBalance,
    cartItems,
    paymentWalletPublicKey,
    totalCartNativeAmount,
    userWallets,
    onPaymentChoose,
  } = props;

  const paymentFioPrpos = {
    paymentOptionsList: [PAYMENT_OPTIONS.FIO],
    isFree,
    hasLowBalance,
    paymentWalletPublicKey,
    cartItems,
    totalCartNativeAmount,
    userWallets,
    onPaymentChoose,
  };

  const otherPaymentsProps = {
    paymentOptionsList: [PAYMENT_OPTIONS.CREDIT_CARD, PAYMENT_OPTIONS.CRYPTO],
    cartItems,
    onPaymentChoose,
  };

  return (
    <>
      <PaymentOptions {...paymentFioPrpos} />
      <OtherPaymentsBlock
        defaultShowState={hasLowBalance}
        disabled={cartItems.length === 0}
        {...otherPaymentsProps}
      />
    </>
  );
};

export default PaymentsBlock;
