import React, { useCallback } from 'react';
import { useHistory } from 'react-router';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { ROUTES } from '../../../../constants/routes';

import classes from './MyCurrentVotes.module.scss';

export const MyCurrentVotes: React.FC = () => {
  const history = useHistory();

  const onClick = useCallback(() => {
    history.push({
      pathname: ROUTES.GOVERNANCE_OVERVIEW,
      state: {
        shouldOpenFirstWallet: true,
      },
    });
  }, [history]);

  return (
    <div className={classes.container}>
      <h5 className={classes.title}>My Current Votes</h5>
      <SubmitButton text="View" className={classes.button} onClick={onClick} />
    </div>
  );
};
