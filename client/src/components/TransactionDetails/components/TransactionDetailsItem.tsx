import { FC, ReactNode } from 'react';

import classes from './TransactionDetailsItem.module.scss';

type Props = {
  name: string;
  value: ReactNode;
};

export const TransactionDetailsItem: FC<Props> = ({ name, value }) => {
  return (
    <div className={classes.item}>
      <span className={classes.name}>{name}</span>
      <div className={classes.value}>{value}</div>
    </div>
  );
};
