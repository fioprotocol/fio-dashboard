import React from 'react';
import classnames from 'classnames';

import classes from './SpecialsBanner.module.scss';

type Props = {
  icon: string;
  mobileIcon?: string;
  title: string;
  subtitle: string;
  isFlipped?: boolean;
  isBigImage?: boolean;
};

export const SpecialsBannerBadge: React.FC<Props> = props => {
  const {
    icon,
    mobileIcon,
    title,
    subtitle,
    isFlipped = false,
    isBigImage = false,
  } = props;

  return (
    <div className={classes.badgeWrapper}>
      <div
        className={classnames(
          classes.badge,
          isFlipped && classes.isFlipped,
          isBigImage && classes.isBigImage,
        )}
      >
        <div className={classes.badgeIcon}>
          <img className={classes.badgeIconDesktop} src={icon} alt={title} />
          <img
            className={classes.badgeIconMobile}
            src={mobileIcon || icon}
            alt={title}
            loading="lazy"
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
