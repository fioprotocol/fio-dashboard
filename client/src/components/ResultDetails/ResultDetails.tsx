import { FC, ReactNode } from 'react';

import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../Badge/Badge';

import classes from './ResultDetails.module.scss';

type Props = {
  show?: boolean;
  label: ReactNode;
  value: ReactNode;
  classNames?: {
    label?: string;
    value?: string;
  };
};

export const ResultDetails: FC<Props> = ({
  show = true,
  label,
  value,
  classNames,
}) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <p className={classnames(classes.badgeLabel, classNames?.label)}>
        {label}
      </p>
      <Badge show type={BADGE_TYPES.SIMPLE}>
        <p className={classnames(classes.badgeValue, classNames?.value)}>
          {value}
        </p>
      </Badge>
    </>
  );
};
