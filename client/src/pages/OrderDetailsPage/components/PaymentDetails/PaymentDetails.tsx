import React from 'react';

import classes from './PaymentDetails.module.scss';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';

import { Roe } from '../../../../types';

type Props = {
  orderNumber: string;
  paidWith?: string;
  totalFioNativeCostPrice?: string;
  isFree?: boolean;
  roe?: Roe;
};

export const PaymentDetails: React.FC<Props> = props => {
  const { orderNumber, paidWith, totalFioNativeCostPrice, isFree, roe } = props;

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
        roe={roe}
      />
    </div>
  );
};
