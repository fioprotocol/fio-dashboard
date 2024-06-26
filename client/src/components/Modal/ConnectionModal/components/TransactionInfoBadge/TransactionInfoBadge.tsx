import React, { PropsWithChildren } from 'react';

import Badge, { BADGE_TYPES } from '../../../../Badge/Badge';

import classes from './TransactionInfoBadge.module.scss';

type Props = PropsWithChildren<{
  title: string;
}>;

export const TransactionInfoBadge: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <p className={classes.badgeLabel}>{title}</p>
      <Badge type={BADGE_TYPES.WHITE} show withoutMargin>
        <p className={classes.badgeContent}>{children}</p>
      </Badge>
    </>
  );
};
