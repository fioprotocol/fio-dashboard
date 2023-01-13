import React from 'react';
import classnames from 'classnames';

import classes from './SpecialsBanner.module.scss';

type Props = {
  icon: string;
  mobileIcon?: string;
  title: string;
  subtitle: string;
  isFlipped?: boolean;
  isBig?: boolean;
};

export const SpecialsBannerBadge: React.FC<Props> = props => {
  const {
    icon,
    mobileIcon,
    title,
    subtitle,
    isFlipped = false,
    isBig = false,
  } = props;

  return (
    <div className={classes.badgeWrapper}>
      <div
        className={classnames(
          classes.badge,
          isFlipped && classes.isFlipped,
          isBig && classes.isBig,
        )}
      >
        <div className={classes.badgeIcon}>
          <img className={classes.badgeIconDesktop} src={icon} alt={title} />
          <img
            className={classes.badgeIconMobile}
            src={mobileIcon || icon}
            alt={title}
          />
        </div>
        <div className={classes.badgeContainer}>
          <div className={classes.badgeTitle}>{title}</div>
          <div className={classes.badgeSubtitle}>{subtitle}</div>
        </div>
      </div>
    </div>
  );
};
