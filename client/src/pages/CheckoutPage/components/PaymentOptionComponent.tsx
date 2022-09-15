import React from 'react';

import { FioPaymentOption } from './FioPaymentOption';
import { StripePaymentOption } from './StripePaymentOption';

import { PAYMENT_PROVIDER } from '../../../constants/purchase';

import { PaymentOptionComponentProps } from '../types';

export const PaymentOptionComponent: React.FC<PaymentOptionComponentProps> = props => {
  const { paymentProvider = PAYMENT_PROVIDER.FIO } = props;

  if (paymentProvider === PAYMENT_PROVIDER.FIO)
    return <FioPaymentOption {...props} />;

  if (paymentProvider === PAYMENT_PROVIDER.STRIPE)
    return <StripePaymentOption {...props} />;

  return null;
};
