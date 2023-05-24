import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { PriceComponent } from '../../../../components/PriceComponent';

import { InfoBadgeComponent } from '../InfoBadgeComponent';

import { OrderItemsList } from '../OrderItemsList';

import {
  ErrBadgesProps,
  OrderItemDetailed,
  OrderDetailedTotalCost,
} from '../../../../types';
import { InfoBadgeData } from '../../types';

import classes from './PartialErroredOrderItemsList.module.scss';

type Props = {
  infoBadgeData: InfoBadgeData;
  items: OrderItemDetailed[];
  errorBadges: ErrBadgesProps;
  totalCostPrice: OrderDetailedTotalCost;
};

export const PartialErroredOrderItemsList: React.FC<Props> = props => {
  const { infoBadgeData, items, errorBadges, totalCostPrice } = props;

  const { fioTotal, freeTotalPrice, usdcTotal } = totalCostPrice || {};

  if (!items) return null;

  return (
    <div className={classes.details}>
      <h5 className={classnames(classes.completeTitle, classes.second)}>
        Purchases Not Completed
      </h5>
      {Object.values(errorBadges).map(
        ({ errorType, total, totalCurrency, items }) => (
          <InfoBadgeComponent
            purchaseStatus={infoBadgeData.purchaseStatus}
            paymentProvider={infoBadgeData.paymentProvider}
            failedMessage={errorType}
            failedTxsTotalAmount={total}
            failedTxsTotalCurrency={totalCurrency}
            key={items[0].id}
          />
        ),
      )}
      <OrderItemsList items={items} />
      <Badge type={BADGE_TYPES.ERROR} show={true}>
        <div className={classnames(classes.item, classes.hasWhiteText)}>
          <span className={classnames(classes.name, 'boldText')}>
            Remaining Cost
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
    </div>
  );
};
