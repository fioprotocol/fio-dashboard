import React from 'react';
import classnames from 'classnames';

import classes from './CartSmallContainer.module.scss';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  isAquaColor?: boolean;
  isHintColor?: boolean;
  hasBigMargin?: boolean;
};

const CartSmallContainer: React.FC<Props> = props => {
  const { children, isAquaColor, isHintColor, hasBigMargin } = props;
  return (
    <div
      className={classnames(
        classes.container,
        isAquaColor && classes.aqua,
        isHintColor && classes.hint,
        hasBigMargin && classes.hasBigMargin,
      )}
    >
      {children}
    </div>
  );
};

export default CartSmallContainer;
