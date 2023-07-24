import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';

import { US_LOCALE } from '../../../constants/common';

import { isDomainExpired } from '../../../util/fio';

import classes from './DateComponent.module.scss';

type Props = {
  domainName: string;
  expiration?: Date;
};

const DateComponent: React.FC<Props> = props => {
  const { domainName, expiration } = props;
  return (
    <>
      {expiration && new Date(expiration).toLocaleDateString(US_LOCALE)}{' '}
      {expiration && isDomainExpired(domainName, expiration) && (
        <WarningIcon className={classes.warnIcon} />
      )}
    </>
  );
};

export default DateComponent;
