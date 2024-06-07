import React from 'react';

import { FioPaymentOption } from './FioPaymentOption';
import { StripePaymentOption } from './StripePaymentOption';

import { PAYMENT_PROVIDER } from '../../../constants/purchase';

import { PaymentOptionComponentProps } from '../types';
import { BitpayPaymentOption } from './BitpayPaymentOption';

export const PaymentOptionComponent: React.FC<PaymentOptionComponentProps> = props => {
  const { paymentProvider = PAYMENT_PROVIDER.FIO } = props;

  if (paymentProvider === PAYMENT_PROVIDER.FIO)
    return <FioPaymentOption key={props.order?.id} {...props} />;

  if (paymentProvider === PAYMENT_PROVIDER.STRIPE)
    return <StripePaymentOption key={props.order?.id} {...props} />;

  if (paymentProvider === PAYMENT_PROVIDER.BITPAY)
    return <BitpayPaymentOption key={props.order?.id} {...props} />;

  return null;
};
