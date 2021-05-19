import React from 'react';
import classes from './CartSmallContainer.module.scss';

const CartSmallContainer = props => {
  const { children, bgColor } = props;
  return (
    <div className={classes.container} style={{ backgroundColor: bgColor }}>
      {children}
    </div>
  );
};

export default CartSmallContainer;
