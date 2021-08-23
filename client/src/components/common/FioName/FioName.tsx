import React from 'react';

import classes from './FioName.module.scss';

type Props = {
  name: string;
};

const FioName: React.FC<Props> = props => {
  const { name } = props;
  return (
    <div className={classes.addressContainer}>
      <h5 className={classes.title}>Address:</h5>
      <h5 className={classes.name}>{name}</h5>
    </div>
  );
};

export default FioName;
