import React from 'react';

import classes from './PaymentDetails.module.scss';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';

type Props = {
  orderNumber: string;
  paidWith?: string;
  totalFioNativeCostPrice?: string;
  isFree?: boolean;
};

export const PaymentDetails: React.FC<Props> = props => {
  const { orderNumber, paidWith, totalFioNativeCostPrice, isFree } = props;

  const paidWithTitle = isFree ? 'Assigned To' : 'Paid With';

  return (
    <div className={classes.details}>
      <h6 className={classes.subtitle}>Payment Details</h6>
      <TransactionDetails
        feeInFio="0"
        amountInFio={totalFioNativeCostPrice}
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
