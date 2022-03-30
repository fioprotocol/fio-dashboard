import React from 'react';

import CommonBadge from '../CommonBadge/CommonBadge';
import { statusBadgeColours } from '../../../util/fio';

import classes from './FioRequestStatusBadge.module.scss';
import { FIO_REQUEST_STATUS_TYPES_TITLES } from '../../../constants/fio';

type Props = {
  status?: string;
};

const FioRequestStatusBadge: React.FC<Props> = props => {
  const { status } = props;

  if (!status) return null;

  return (
    <CommonBadge {...statusBadgeColours(status)}>
      <p className={classes.status}>
        {FIO_REQUEST_STATUS_TYPES_TITLES[status]}
      </p>
    </CommonBadge>
  );
};

export default FioRequestStatusBadge;
