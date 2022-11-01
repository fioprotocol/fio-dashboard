import React from 'react';

import { OrderItem } from '../OrderItem/OrderItem';

import { OrderItemDetailed, PaymentCurrency } from '../../../../types';

import classes from './OrderItemsList.module.scss';

type Props = {
  items: OrderItemDetailed[];
  primaryCurrency: PaymentCurrency;
};

export const OrderItemsList: React.FC<Props> = props => {
  const { items, primaryCurrency } = props;

  if (!items) return null;

  return (
    <div className={classes.details}>
      <h6 className={classes.subtitle}>Transaction Details</h6>
      {items.map(orderItem => (
        <OrderItem
          {...orderItem}
          key={orderItem.id}
          primaryCurrency={primaryCurrency}
        />
      ))}
    </div>
  );
};
