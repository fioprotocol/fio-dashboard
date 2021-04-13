import React from 'react';
import classnames from 'classnames';
import classes from './Badge.module.scss';
import colors from '../../assets/styles/colorsToJs.module.scss';

export const BADGE_BG_COLOR = {
  WARN: 'warn',
  INFO: 'info',
  SUCCESS: 'success',
  REGULAR: 'regular',
  SIMPLE: 'simple',
};

const BADGE_BG_COLOR_TYPE = {
  [BADGE_BG_COLOR.WARN]: colors['simple-red'],
  [BADGE_BG_COLOR.INFO]: colors['blue'],
  [BADGE_BG_COLOR.SUCCESS]: colors['irish-green'],
  [BADGE_BG_COLOR.REGULAR]: colors['cyan'],
  [BADGE_BG_COLOR.SIMPLE]: colors['desert-storm'],
};

const Badge = props => {
  const { children, bgColor, show } = props;

  return (
    <div className={classnames(classes.badge, show && classes.show)} style={{ backgroundColor: BADGE_BG_COLOR_TYPE[bgColor] }}>
      {children}
    </div>
  )
};

export default Badge;
