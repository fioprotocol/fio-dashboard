import { FC } from 'react';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { DataValue } from '../../../../components/FioTokensReceive/components/DataValue';

import classes from './PublicAddressBadge.module.scss';

type Props = {
  publicKey: string;
};

export const PublicAddressBadge: FC<Props> = ({ publicKey }) => {
  return (
    <Badge type={BADGE_TYPES.WHITE} show className={classes.badgeContainer}>
      <div className={classes.dataContainer}>
        <div className={classes.title}>Public Address</div>
        <div className={classes.value}>
          <DataValue value={publicKey} />
        </div>
      </div>
    </Badge>
  );
};
