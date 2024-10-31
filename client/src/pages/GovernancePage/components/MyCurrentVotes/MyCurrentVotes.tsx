import React, { useCallback } from 'react';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import classes from './MyCurrentVotes.module.scss';

export const MyCurrentVotes: React.FC = () => {
  const onClick = useCallback(() => {
    // TODO: redirect to Wallet’s Voting Details Page
  }, []);

  return (
    <div className={classes.container}>
      <h5 className={classes.title}>My Current Voutes</h5>
      <SubmitButton text="View" className={classes.button} onClick={onClick} />
    </div>
  );
};
