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
  RED: 'red',
};

export type CommonBadgeProps = {
  className?: string;
};

type Props = {
  children: React.ReactNode;
  type: string;
  show?: boolean;
  hasDefaultFontSize?: boolean;
  withoutMargin?: boolean;
  withoutMaxWidth?: boolean;
} & CommonBadgeProps;

const Badge: React.FC<Props> = props => {
  const {
    children,
    hasDefaultFontSize,
    type,
    show,
    withoutMargin,
    withoutMaxWidth,
    className = '',
  } = props;

  return (
    <div
      className={classnames(
        classes.badge,
        show && classes.show,
        !show && classes.hidden,
        hasDefaultFontSize && classes.hasDefaultFontSize,
        withoutMargin && classes.withoutMargin,
        withoutMaxWidth && classes.withoutMaxWidth,
        type && classes[type.toLowerCase()],
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
