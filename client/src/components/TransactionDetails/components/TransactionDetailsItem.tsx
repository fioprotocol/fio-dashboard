import { FC, ReactNode } from 'react';

import classnames from 'classnames';

import classes from './TransactionDetailsItem.module.scss';

type Props = {
  name: string;
  value: ReactNode;
  position?: 'left' | 'right';
};

export const TransactionDetailsItem: FC<Props> = ({
  name,
  value,
  position = 'left',
}) => {
  return (
    <>
      <span className={classes.name}>{name}</span>
      <div className={classnames(classes.value, position)}>{value}</div>
    </>
  );
};
