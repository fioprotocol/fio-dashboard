import React from 'react';

import { FioPaymentOption } from './FioPaymentOption';
import { StripePaymentOption } from './StripePaymentOption';

import { PURCHASE_PROVIDER } from '../../../constants/purchase';

import { PaymentOptionComponentProps } from '../types';

export const PaymentOptionComponent: React.FC<PaymentOptionComponentProps> = props => {
  const { paymentProvider = PURCHASE_PROVIDER.FIO } = props;

  if (paymentProvider === PURCHASE_PROVIDER.FIO)
    return <FioPaymentOption {...props} />;

  if (paymentProvider === PURCHASE_PROVIDER.STRIPE)
    return <StripePaymentOption {...props} />;

  return null;
};
