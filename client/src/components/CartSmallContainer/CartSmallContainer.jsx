import React from 'react';
import classes from './CartSmallContainer.module.scss';

const CartSmallContainer = props => {
  const { children } = props;
  return <div className={classes.container}>{children}</div>;
};

export default CartSmallContainer;
