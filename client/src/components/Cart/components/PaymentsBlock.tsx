import React from 'react';

import { PaymentOptions } from '../../PaymentOptions';

import OtherPaymentsBlock from './OtherPaymentsBlock';

import { PAYMENT_OPTIONS } from '../../../constants/purchase';

import { CartItem, FioWalletDoublet, PurchaseProvider } from '../../../types';

type Props = {
  isFree?: boolean;
  onPaymentChoose: (paymentProvider: PurchaseProvider) => void;
  hasLowBalance?: boolean;
  paymentWalletPublicKey?: string;
  cartItems?: CartItem[];
  totalCartNativeAmount: number;
  userWallets: FioWalletDoublet[];
  loading: boolean;
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
    loading,
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
    loading,
    disabled,
    onPaymentChoose,
  };

  const otherPaymentsProps = {
    paymentOptionsList: [PAYMENT_OPTIONS.CREDIT_CARD, PAYMENT_OPTIONS.CRYPTO],
    cartItems,
    loading,
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
