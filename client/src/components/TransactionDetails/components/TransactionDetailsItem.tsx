import { FC, ReactNode } from 'react';

import classnames from 'classnames';

import { POSITIONS, PositionValue } from '../constants';

import classes from './TransactionDetailsItem.module.scss';

type Props = {
  name: string;
  value: ReactNode;
  position?: PositionValue;
};

export const TransactionDetailsItem: FC<Props> = ({
  name,
  value,
  position = POSITIONS.LEFT,
}) => {
  return (
    <>
      <span className={classes.name}>{name}</span>
      <div className={classnames(classes.value, position)}>{value}</div>
    </>
  );
};
