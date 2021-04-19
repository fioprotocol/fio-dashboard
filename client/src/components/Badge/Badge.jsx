import React from 'react';
import classnames from 'classnames';
import classes from './Badge.module.scss';
import colors from '../../assets/styles/colorsToJs.module.scss';

export const BADGE_TYPES = {
  WARNING: 'WARNING',
  ALERT: 'ALERT',
  ERROR: 'ERROR',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  REGULAR: 'REGULAR',
  SIMPLE: 'SIMPLE',
};

export const BADGE_BG_COLOR = {
  [BADGE_TYPES.WARNING]: colors['simple-orange'],
  [BADGE_TYPES.ALERT]: colors['simple-red'],
  [BADGE_TYPES.ERROR]: colors['simple-red'],
  [BADGE_TYPES.INFO]: colors['blue'],
  [BADGE_TYPES.SUCCESS]: colors['irish-green'],
  [BADGE_TYPES.REGULAR]: colors['cyan'],
  [BADGE_TYPES.SIMPLE]: colors['desert-storm'],
};

const Badge = props => {
  const { children, type, show } = props;

  return (
    <div
      className={classnames(classes.badge, show && classes.show)}
      style={{ backgroundColor: BADGE_BG_COLOR[type] }}
    >
      {children}
    </div>
  );
};

export default Badge;
