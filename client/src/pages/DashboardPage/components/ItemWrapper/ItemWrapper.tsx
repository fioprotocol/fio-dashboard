import React from 'react';
import classnames from 'classnames';

import classes from './ItemWrapper.module.scss';

type Props = {
  hasFitContentWidth?: boolean;
  hasFullWidth?: boolean;
  hasSmallBorderRadius?: boolean;
  isShrinked?: boolean;
};

export const ItemWrapper: React.FC<Props> = props => {
  const {
    children,
    hasFitContentWidth,
    hasFullWidth,
    hasSmallBorderRadius,
    isShrinked,
  } = props;
  return (
    <div
      className={classnames(
        classes.container,
        hasFitContentWidth && classes.hasFitContentWidth,
        hasFullWidth && classes.hasFullWidth,
        hasSmallBorderRadius && classes.hasSmallBorderRadius,
        isShrinked && classes.isShrinked,
      )}
    >
      {children}
    </div>
  );
};
