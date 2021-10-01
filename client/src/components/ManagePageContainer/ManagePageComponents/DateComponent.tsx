import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BoolStateFunc, IsExpiredFunc } from '../types';

import classes from './DateComponent.module.scss';

type Props = {
  expiration: Date;
  isExpired: IsExpiredFunc;
  toggleShowWarnBadge: BoolStateFunc;
};

const DateComponent: React.FC<Props> = props => {
  const { expiration, isExpired, toggleShowWarnBadge } = props;
  return (
    <>
      {expiration && new Date(expiration).toLocaleDateString('en-US')}{' '}
      {isExpired(expiration) && (
        <FontAwesomeIcon
          icon="exclamation-triangle"
          className={classes.warnIcon}
          onClick={() => toggleShowWarnBadge(true)}
        />
      )}
    </>
  );
};

export default DateComponent;
