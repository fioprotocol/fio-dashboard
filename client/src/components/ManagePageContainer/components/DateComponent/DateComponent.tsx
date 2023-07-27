import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';

import { US_LOCALE } from '../../../../constants/common';

import { isDomainExpired } from '../../../../util/fio';
import { convertToNewDate } from '../../../../util/general';

import classes from './DateComponent.module.scss';

type Props = {
  domainName: string;
  expiration?: number | string;
};

export const DateComponent: React.FC<Props> = props => {
  const { domainName, expiration } = props;

  const expirationDate = convertToNewDate(expiration);

  return (
    <>
      {expiration && expirationDate.toLocaleDateString(US_LOCALE)}{' '}
      {expiration && isDomainExpired(domainName, expiration) && (
        <WarningIcon className={classes.warnIcon} />
      )}
    </>
  );
};
