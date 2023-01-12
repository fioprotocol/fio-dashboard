import React from 'react';
import classnames from 'classnames';

import classes from './CommonBadge.module.scss';

type Props = {
  isBlack?: boolean;
  isBlue?: boolean;
  isBlueGreen?: boolean;
  isGreen?: boolean;
  isOrange?: boolean;
  isRose?: boolean;
  isRed?: boolean;
  children: React.ReactNode;
  hasRoundBorders?: boolean;
};

const CommonBadge: React.FC<Props> = props => {
  const {
    hasRoundBorders,
    isBlack,
    children,
    isBlue,
    isBlueGreen,
    isGreen,
    isOrange,
    isRose,
    isRed,
  } = props;
  return (
    <div
      className={classnames(
        classes.container,
        hasRoundBorders && classes.hasRoundBorders,
        isBlack && classes.isBlack,
        isBlue && classes.isBlue,
        isBlueGreen && classes.isBlueGreen,
        isGreen && classes.isGreen,
        isOrange && classes.isOrange,
        isRose && classes.isRose,
        isRed && classes.isRed,
      )}
    >
      {children}
    </div>
  );
};

export default CommonBadge;
