import { FC, ReactNode } from 'react';

import Badge, { BADGE_TYPES } from '../Badge/Badge';

import classes from './ResultDetails.module.scss';

type Props = {
  show?: boolean;
  label: ReactNode;
  value: ReactNode;
};

export const ResultDetails: FC<Props> = ({ show = true, label, value }) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <p className={classes.badgeLabel}>{label}</p>
      <Badge show type={BADGE_TYPES.SIMPLE}>
        <p className={classes.badgeValue}>{value}</p>
      </Badge>
    </>
  );
};
