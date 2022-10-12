import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import PriceBadge from '../../../../components/Badges/PriceBadge/PriceBadge';

import { TotalCost } from '../../types';

import classes from './PaymentDetails.module.scss';

type Props = {
  orderNumber: string;
  paidWith?: string;
  totalCost: TotalCost;
};

export const PaymentDetails: React.FC<Props> = props => {
  const { orderNumber, paidWith, totalCost } = props;

  const {
    convertedPaymentAmount,
    convertedPaymentCurrency,
    costFree,
    paymentAmount,
    paymentCurrency,
  } = totalCost || {};

  return (
    <div className={classes.details}>
      <h6 className={classes.subtitle}>Payment Details</h6>
      <PriceBadge
        paymentAmount={paymentAmount}
        paymentCurrency={paymentCurrency}
        convertedPaymentAmount={convertedPaymentAmount}
        convertedPaymentCurrency={convertedPaymentCurrency}
        costFree={costFree}
        title="Total Cost"
        type={BADGE_TYPES.BLACK}
      />
      <Badge type={BADGE_TYPES.WHITE} show={true}>
        <div className={classes.item}>
          <span className={classnames(classes.name, 'boldText')}>
            Paid With
          </span>
          <p className={classes.itemValue}>
            <span className="boldText">{paidWith}</span>
          </p>
        </div>
      </Badge>
      <Badge type={BADGE_TYPES.WHITE} show={!!orderNumber}>
        <div className={classes.item}>
          <span className={classnames(classes.name, 'boldText')}>
            Order No.
          </span>
          <p className={classes.itemValue}>
            <span className="boldText">{orderNumber}</span>
          </p>
        </div>
      </Badge>
    </div>
  );
};
