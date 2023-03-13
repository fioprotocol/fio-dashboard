import React from 'react';
import classnames from 'classnames';

import classes from './ItemWrapper.module.scss';

type Props = {
  hasSmallBorderRadius?: boolean;
};

export const ItemWrapper: React.FC<Props> = props => {
  const { children, hasSmallBorderRadius } = props;
  return (
    <div
      className={classnames(
        classes.container,
        hasSmallBorderRadius && classes.hasSmallBorderRadius,
      )}
    >
      {children}
    </div>
  );
};
