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
  containerClassname?: string;
};

const Badge: React.FC<Props> = props => {
  const { children, type, show, containerClassname } = props;

  if (!show) return null;

  return (
    <div
      className={classnames(
        classes.badge,
        classes.show,
        type && classes[type.toLowerCase()],
        containerClassname,
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
