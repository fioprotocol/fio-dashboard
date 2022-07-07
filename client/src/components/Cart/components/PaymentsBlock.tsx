import React from 'react';

import { PaymentOptions } from '../../PaymentOptions';

import OtherPaymentsBlock from './OtherPaymentsBlock';

import { PAYMENT_OPTIONS } from '../../../constants/purchase';

import { CartItem as CartItemProps, FioWalletDoublet } from '../../../types';

type Props = {
  isFree?: boolean;
  recalculateBalance?: () => void;
  hasLowBalance?: boolean;
  paymentWalletPublicKey?: string;
  cartItems?: CartItemProps[];
  totalCartNativeAmount: number;
  userWallets: FioWalletDoublet[];
};

const PaymentsBlock: React.FC<Props> = props => {
  const {
    isFree,
    hasLowBalance,
    recalculateBalance,
    cartItems,
    paymentWalletPublicKey,
    totalCartNativeAmount,
    userWallets,
  } = props;

  const paymentFioPrpos = {
    paymentOptionsList: [PAYMENT_OPTIONS.FIO],
    isFree,
    recalculateBalance,
    hasLowBalance,
    paymentWalletPublicKey,
    cartItems,
    totalCartNativeAmount,
    userWallets,
  };

  const otherPaymentsProps = {
    paymentOptionsList: [PAYMENT_OPTIONS.CREDIT_CARD, PAYMENT_OPTIONS.CRYPTO],
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
