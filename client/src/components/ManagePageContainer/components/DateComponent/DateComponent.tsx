import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';

import { US_LOCALE } from '../../../../constants/common';

import { convertToNewDate } from '../../../../util/general';

import classes from './DateComponent.module.scss';

type Props = {
  expiration?: number | string;
  isExpired: boolean;
  isExpiredIn30Days: boolean;
};

export const DateComponent: React.FC<Props> = props => {
  const { expiration, isExpired, isExpiredIn30Days } = props;

  const expirationDate = convertToNewDate(expiration);

  return (
    <>
      {expiration && expirationDate.toLocaleDateString(US_LOCALE)}{' '}
      {expiration && (isExpired || isExpiredIn30Days) && (
        <WarningIcon className={classes.warnIcon} />
      )}
    </>
  );
};
