import React from 'react';
import classnames from 'classnames';

import classes from './GradeBadge.module.scss';

type Props = {
  grade: string;
};

export const GradeBadge: React.FC<Props> = ({ grade }) => {
  let color;

  switch (true) {
    case grade.includes('A'):
      color = 'isGreen';
      break;
    case grade.includes('B'):
      color = 'isYellow';
      break;
    case grade.includes('C'):
      color = 'isOrange';
      break;
    case grade.includes('D'):
      color = 'isRose';
      break;
    case grade.includes('F'):
      color = 'isRed';
      break;
    default:
      break;
  }

  return (
    <div className={classnames(classes.container, classes[color])}>{grade}</div>
  );
};
