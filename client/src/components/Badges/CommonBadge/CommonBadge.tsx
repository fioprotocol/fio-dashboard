import React from 'react';
import classnames from 'classnames';

import classes from './CommonBadge.module.scss';

type Props = {
  isBlack?: boolean;
  isBlue?: boolean;
  isGreen?: boolean;
  isOrange?: boolean;
  isRose?: boolean;
  children: React.ReactNode;
};

const CommonBadge: React.FC<Props> = props => {
  const { isBlack, children, isBlue, isGreen, isOrange, isRose } = props;
  return (
    <div
      className={classnames(
        classes.container,
        isBlack && classes.isBlack,
        isBlue && classes.isBlue,
        isGreen && classes.isGreen,
        isOrange && classes.isOrange,
        isRose && classes.isRose,
      )}
    >
      {children}
    </div>
  );
};

export default CommonBadge;
