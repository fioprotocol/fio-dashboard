import React from 'react';

import { OrderDetailedTotalCost } from '../../../../types';

import classes from './PaymentDetails.module.scss';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';

type Props = {
  orderNumber: string;
  paidWith?: string;
  totalCostPrice: OrderDetailedTotalCost;
};

export const PaymentDetails: React.FC<Props> = props => {
  const {
    orderNumber,
    paidWith,
    totalCostPrice: { freeTotalPrice, fioNativeTotal } = {},
  } = props;

  const isFree = freeTotalPrice === 'FREE';
  const paidWithTitle = freeTotalPrice === 'FREE' ? 'Assigned To' : 'Paid With';

  return (
    <div className={classes.details}>
      <h6 className={classes.subtitle}>Payment Details</h6>
      <TransactionDetails
        feeInFio={0}
        amountInFio={fioNativeTotal}
        additional={[
          {
            label: paidWithTitle,
            value: paidWith,
            hide: isFree || !paidWith,
          },
          {
            label: 'Order No.',
            value: orderNumber,
            hide: !orderNumber,
          },
        ]}
      />
    </div>
  );
};
