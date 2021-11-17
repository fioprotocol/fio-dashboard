import React from 'react';
import classnames from 'classnames';

import classes from './CommonBadge.module.scss';

type Props = {
  isBlack?: boolean;
  isBlue?: boolean;
  isGreen?: boolean;
  children: React.ReactNode;
};

const CommonBadge: React.FC<Props> = props => {
  const { isBlack, children, isBlue, isGreen } = props;
  return (
    <div
      className={classnames(
        classes.container,
        isBlack && classes.isBlack,
        isBlue && classes.isBlue,
        isGreen && classes.isGreen,
      )}
    >
      {children}
    </div>
  );
};

export default CommonBadge;
