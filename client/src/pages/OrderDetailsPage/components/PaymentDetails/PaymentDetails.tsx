import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';

import classes from './PaymentDetails.module.scss';

type Props = {
  orderNumber: string;
  paidWith?: string;
  totalCostPrice: string;
};

export const PaymentDetails: React.FC<Props> = props => {
  const { orderNumber, paidWith, totalCostPrice } = props;

  const isFree = totalCostPrice === 'FREE';
  const paidWithTitle = totalCostPrice === 'FREE' ? 'Assigned To' : 'Paid With';

  return (
    <div className={classes.details}>
      <h6 className={classes.subtitle}>Payment Details</h6>
      <Badge type={BADGE_TYPES.BLACK} show={true}>
        <div className={classnames(classes.item, classes.hasWhiteText)}>
          <span className={classnames(classes.name, 'boldText')}>
            Total Cost
          </span>
          <p className={classnames(classes.itemValue, classes.withAutoMargin)}>
            <span className="boldText">{totalCostPrice}</span>
          </p>
        </div>
      </Badge>
      <Badge type={BADGE_TYPES.WHITE} show={!isFree && !!paidWith}>
        <div className={classes.item}>
          <span className={classnames(classes.name, 'boldText')}>
            {paidWithTitle}
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
