import React from 'react';

import InfoBadge from '../../../../../components/Badges/InfoBadge/InfoBadge';

import classes from './TabUIContainer.module.scss';

type Props = {
  emptyState?: {
    message: string;
    title: string;
  };
  showEmptyState?: boolean;
  subtitle: string;
  title: string;
};

export const TabUIContainer: React.FC<Props> = props => {
  const { children, emptyState, showEmptyState, subtitle, title } = props;

  return (
    <div className={classes.container}>
      <h4 className={classes.title}>{title}</h4>
      <p className={classes.subtitle}>{subtitle}</p>
      <div className={classes.contentContainer}>
        {showEmptyState ? <InfoBadge {...emptyState} /> : children}
      </div>
    </div>
  );
};
