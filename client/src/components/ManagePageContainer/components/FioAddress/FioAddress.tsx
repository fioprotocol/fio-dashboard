import React from 'react';

import classes from './FioAddress.module.scss';

type Props = {
  name: string;
};

export const FioAddress: React.FC<Props> = props => {
  const { name } = props;
  return (
    <div className={classes.nameContainer}>
      <p className={classes.name}>{name}</p>
    </div>
  );
};
