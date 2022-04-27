import React from 'react';
import classnames from 'classnames';

import classes from './Badge.module.scss';

export const BADGE_TYPES = {
  WARNING: 'warning',
  ALERT: 'alert',
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  REGULAR: 'regular',
  SIMPLE: 'simple',
  WHITE: 'white',
  BLACK: 'black',
  BORDERED: 'bordered',
};

export type CommonBadgeProps = {
  className?: string;
};

type Props = {
  children: React.ReactNode;
  type: string;
  show?: boolean;
} & CommonBadgeProps;

const Badge: React.FC<Props> = props => {
  const { children, type, show, className = '' } = props;

  return (
    <div
      className={classnames(
        classes.badge,
        show && classes.show,
        !show && classes.hidden,
        type && classes[type.toLowerCase()],
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
