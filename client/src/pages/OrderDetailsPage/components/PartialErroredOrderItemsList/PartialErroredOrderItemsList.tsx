import React from 'react';
import classnames from 'classnames';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';
import PriceBadge from '../../../../components/Badges/PriceBadge/PriceBadge';
import { InfoBadgeComponent } from '../InfoBadgeComponent';

import { OrderItemsList } from '../OrderItemsList';

import { OrderItemDetailed, PaymentCurrency } from '../../../../types';
import { InfoBadgeData, ErrBadgesProps, TotalCost } from '../../types';

import classes from './PartialErroredOrderItemsList.module.scss';

type Props = {
  infoBadgeData: InfoBadgeData;
  items: OrderItemDetailed[];
  errorBadges: ErrBadgesProps;
  primaryCurrency: PaymentCurrency;
  totalCost: TotalCost;
};

const PRICE_BADGE_TITLE = 'Remaining Cost';

export const PartialErroredOrderItemsList: React.FC<Props> = props => {
  const {
    infoBadgeData,
    items,
    errorBadges,
    primaryCurrency,
    totalCost,
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
      <PriceBadge
        {...totalCost}
        title={PRICE_BADGE_TITLE}
        type={BADGE_TYPES.ERROR}
      />
    </div>
  );
};
