import React from 'react';

import { ExclamationIcon } from '../ExclamationIcon';

import classes from './FunFactLabel.module.scss';

type Props = {
  children: React.ReactNode;
};

export const FunFactLabel: React.FC<Props> = props => {
  const { children } = props;

  return (
    <div className={classes.container}>
      <ExclamationIcon />
      <div className={classes.textContainer}>
        <span className={classes.textLabel}>Fun Fact ..</span>
        {children}
      </div>
    </div>
  );
};
