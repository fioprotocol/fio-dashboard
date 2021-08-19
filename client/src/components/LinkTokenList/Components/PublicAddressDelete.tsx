import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import { CheckedPublicAddressType } from '../types';

import classes from './PublicAddress.module.scss';

type Props = {
  hasLowBalance: boolean;
  onCheckClick: (id: string) => void;
} & CheckedPublicAddressType;

const PublicAddressDelete: React.FC<Props> = props => {
  const {
    chainCode,
    id,
    isChecked,
    hasLowBalance,
    onCheckClick,
    publicAddress,
    tokenCode,
  } = props;

  const isInactive = hasLowBalance && !isChecked;

  const onClick = () => !isInactive && onCheckClick(id);

  return (
    <Badge show={true} type={BADGE_TYPES.WHITE}>
      <div className={classes.badgeContainer}>
        <div className={classes.publicAddressContainer}>
          <p className="boldText">{tokenCode}</p>
          <p className={classes.chainCode}>
            Chain Code: <span className="boldText">{chainCode}</span>
          </p>
          <p className={classes.publicAddressItem}>{publicAddress}</p>
        </div>
        <FontAwesomeIcon
          icon={
            isChecked ? 'check-square' : { prefix: 'far', iconName: 'square' }
          }
          className={classnames(
            classes.checkIcon,
            isInactive && classes.inactiveIcon,
          )}
          onClick={onClick}
        />
      </div>
    </Badge>
  );
};

export default PublicAddressDelete;
