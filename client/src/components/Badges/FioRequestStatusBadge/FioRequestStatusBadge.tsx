import React from 'react';
import CommonBadge from '../CommonBadge/CommonBadge';
import { statusBadgeColours } from '../../../util/fio';

import classes from './FioRequestStatusBadge.module.scss';

type Props = {
  status: string;
};

const FioRequestStatusBadge: React.FC<Props> = props => {
  const { status } = props;
  return (
    <CommonBadge {...statusBadgeColours(status)}>
      <p className={classes.status}>{status}</p>
    </CommonBadge>
  );
};

export default FioRequestStatusBadge;
