import { FC } from 'react';

import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { DataValue } from '../../../../components/FioTokensReceive/components/DataValue';

import classes from './PublicAddressBadge.module.scss';

type Props = {
  className: string;
  publicKey: string;
};

export const PublicAddressBadge: FC<Props> = ({ className, publicKey }) => {
  return (
    <Badge
      type={BADGE_TYPES.WHITE}
      show
      className={classnames(classes.badgeContainer, className)}
    >
      <div className={classes.dataContainer}>
        <div className={classes.title}>Public Address</div>
        <div className={classes.value}>
          <DataValue value={publicKey} />
        </div>
      </div>
    </Badge>
  );
};
