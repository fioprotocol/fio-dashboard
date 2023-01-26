import React from 'react';
import classnames from 'classnames';

import { CartItemPrice, CartItemProps } from '../../../Cart/CartItem';

import classes from './PriceItem.module.scss';

type Props = {
  hasSmallFontSize?: boolean;
  hasMarginRight?: boolean;
} & CartItemProps;

export const PirceItem: React.FC<Props> = props => {
  const { hasSmallFontSize, hasMarginRight } = props;

  return (
    <div
      className={classnames(
        classes.container,
        hasSmallFontSize && classes.hasSmallFontSize,
        hasMarginRight && classes.hasMarginRight,
      )}
    >
      <CartItemPrice {...props} />
    </div>
  );
};
