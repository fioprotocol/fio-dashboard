import React from 'react';

import { OrderItem } from '../OrderItem/OrderItem';

import { OrderItemDetailed } from '../../../../types';

import classes from './OrderItemsList.module.scss';

type Props = {
  items: OrderItemDetailed[];
};

export const OrderItemsList: React.FC<Props> = props => {
  const { items } = props;

  if (!items) return null;

  return (
    <div className={classes.details}>
      <h6 className={classes.subtitle}>Transaction Details</h6>
      {items.map(orderItem => (
        <OrderItem {...orderItem} key={orderItem.id} />
      ))}
    </div>
  );
};
