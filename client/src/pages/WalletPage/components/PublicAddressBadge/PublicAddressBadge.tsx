import { FC } from 'react';

import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { DataValue } from '../../../../components/FioTokensReceive/components/DataValue';

import classes from './PublicAddressBadge.module.scss';

type Props = {
  publicKey: string;
  classNames?: {
    badgeContainer?: string;
    dataContainer?: string;
    title?: string;
    value?: string;
  };
};

export const PublicAddressBadge: FC<Props> = ({ classNames, publicKey }) => {
  return (
    <Badge
      type={BADGE_TYPES.WHITE}
      show
      className={classnames(classes.badgeContainer, classNames.badgeContainer)}
    >
      <div
        className={classnames(classes.dataContainer, classNames.dataContainer)}
      >
        <div className={classnames(classes.title, classNames.title)}>
          Public Address
        </div>
        <div className={classnames(classes.value, classNames.value)}>
          <DataValue value={publicKey} />
        </div>
      </div>
    </Badge>
  );
};
