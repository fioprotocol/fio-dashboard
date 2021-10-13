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

type Props = {
  children: React.ReactNode;
  type: string;
  show?: boolean;
};

const Badge: React.FC<Props> = props => {
  const { children, type, show } = props;

  return (
    <div
      className={classnames(
        classes.badge,
        show && classes.show,
        type && classes[type.toLowerCase()],
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
