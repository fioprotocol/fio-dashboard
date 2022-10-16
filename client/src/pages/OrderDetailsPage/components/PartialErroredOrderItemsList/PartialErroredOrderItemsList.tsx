import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { InfoBadgeComponent } from '../InfoBadgeComponent';

import { OrderItemsList } from '../OrderItemsList';

import { OrderItemDetailed, PaymentCurrency } from '../../../../types';
import { InfoBadgeData, ErrBadgesProps } from '../../types';

import classes from './PartialErroredOrderItemsList.module.scss';

type Props = {
  infoBadgeData: InfoBadgeData;
  items: OrderItemDetailed[];
  errorBadges: ErrBadgesProps;
  primaryCurrency: PaymentCurrency;
  totalCostPrice: string;
};

export const PartialErroredOrderItemsList: React.FC<Props> = props => {
  const {
    infoBadgeData,
    items,
    errorBadges,
    primaryCurrency,
    totalCostPrice,
  } = props;

  if (!items) return null;

  return (
    <div className={classes.details}>
      <h5 className={classnames(classes.completeTitle, classes.second)}>
        Purchases Not Completed
      </h5>
      {Object.values(errorBadges).map(({ errorType, total, totalCurrency }) => (
        <InfoBadgeComponent
          purchaseStatus={infoBadgeData.purchaseStatus}
          paymentProvider={infoBadgeData.paymentProvider}
          failedMessage={errorType}
          failedTxsTotalAmount={total}
          failedTxsTotalCurrency={totalCurrency}
          key={total}
        />
      ))}
      <OrderItemsList items={items} primaryCurrency={primaryCurrency} />
      <Badge type={BADGE_TYPES.ERROR} show={true}>
        <div className={classnames(classes.item, classes.hasWhiteText)}>
          <span className={classnames(classes.name, 'boldText')}>
            Remaining Cost
          </span>
          <p className={classnames(classes.itemValue, classes.withAutoMargin)}>
            <span className="boldText">{totalCostPrice}</span>
          </p>
        </div>
      </Badge>
    </div>
  );
};
