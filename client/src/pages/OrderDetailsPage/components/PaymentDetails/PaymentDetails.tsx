import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { PriceComponent } from '../../../../components/PriceComponent';

import { OrderDetailedTotalCost } from '../../../../types';

import classes from './PaymentDetails.module.scss';

type Props = {
  orderNumber: string;
  paidWith?: string;
  totalCostPrice: OrderDetailedTotalCost;
};

export const PaymentDetails: React.FC<Props> = props => {
  const {
    orderNumber,
    paidWith,
    totalCostPrice: { fioTotal, freeTotalPrice, usdcTotal } = {},
  } = props;

  const isFree = freeTotalPrice === 'FREE';
  const paidWithTitle = freeTotalPrice === 'FREE' ? 'Assigned To' : 'Paid With';

  return (
    <div className={classes.details}>
      <h6 className={classes.subtitle}>Payment Details</h6>
      <Badge type={BADGE_TYPES.BLACK} show={true}>
        <div className={classnames(classes.item, classes.hasWhiteText)}>
          <span className={classnames(classes.name, 'boldText')}>
            Total Cost
          </span>
          <div
            className={classnames(classes.itemValue, classes.withAutoMargin)}
          >
            <PriceComponent
              costFio={fioTotal}
              costUsdc={usdcTotal?.toString()}
              isFree={!!freeTotalPrice}
            />
          </div>
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
