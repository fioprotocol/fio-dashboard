import React from 'react';

import { PurchaseNow } from '../../../components/PurchaseNow';

import { PaymentOptionComponentProps } from '../types';

export const FioPaymentOption: React.FC<PaymentOptionComponentProps> = props => {
  const { onFinish, payWith } = props;

  return (
    <PurchaseNow
      onFinish={onFinish}
      disabled={!!payWith.find(it => it.notEnoughFio)}
    />
  );
};
