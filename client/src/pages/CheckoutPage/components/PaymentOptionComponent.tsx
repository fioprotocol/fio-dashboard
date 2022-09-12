import React from 'react';

import { FioPaymentOption } from './FioPaymentOption';
import { StripePaymentOption } from './StripePaymentOption';

import { PAYMENT_OPTIONS } from '../../../constants/purchase';

import { PaymentOptionComponentProps } from '../types';

export const PaymentOptionComponent: React.FC<PaymentOptionComponentProps> = props => {
  const { paymentOption = PAYMENT_OPTIONS.FIO } = props;

  if (paymentOption === PAYMENT_OPTIONS.FIO)
    return <FioPaymentOption {...props} />;

  if (paymentOption === PAYMENT_OPTIONS.CREDIT_CARD)
    return <StripePaymentOption {...props} />;

  return null;
};
