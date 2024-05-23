import { FC } from 'react';

import { OrderItem } from '../OrderItem';

import { OrderItemDetailed } from '../../../../types';

import classes from './OrderItemsList.module.scss';

type Props = {
  items: OrderItemDetailed[];
  isOrdered?: boolean;
};

export const OrderItemsList: FC<Props> = props => {
  const { items, isOrdered } = props;

  if (!items) return null;

  return (
    <div className={classes.details}>
      <h6 className={classes.subtitle}>Transaction Details</h6>
      {items.map(orderItem => (
        <OrderItem key={orderItem.id} {...orderItem} isOrdered={isOrdered} />
      ))}
    </div>
  );
};
