import { FC, ReactNode } from 'react';

import classnames from 'classnames';

import { VALUE_POSITIONS, ValuePosition } from '../constants';

import classes from './TransactionDetailsItem.module.scss';

type Props = {
  name: string;
  value: ReactNode;
  position?: ValuePosition;
};

export const TransactionDetailsItem: FC<Props> = ({
  name,
  value,
  position = VALUE_POSITIONS.LEFT,
}) => {
  return (
    <>
      <span className={classes.name}>{name}</span>
      <div className={classnames(classes.value, classes[position])}>
        {value}
      </div>
    </>
  );
};
