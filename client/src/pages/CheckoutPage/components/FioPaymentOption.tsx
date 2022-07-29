import React from 'react';

import PurchaseNow from '../../../components/PurchaseNow';

import { PaymentWallet } from './PaymentWallet';

import { PaymentOptionComponentProps } from '../types';

export const FioPaymentOption: React.FC<PaymentOptionComponentProps> = props => {
  const { onFinish, ...rest } = props;

  return (
    <>
      <PaymentWallet {...rest} />
      <PurchaseNow onFinish={onFinish} />
    </>
  );
};
