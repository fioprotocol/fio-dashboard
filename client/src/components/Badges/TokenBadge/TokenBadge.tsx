import React from 'react';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import { PublicAddressDoublet } from '../../../types';
import classes from './TokenBadge.module.scss';

type Props = {
  actionButton?: React.ReactNode;
  input?: React.ReactNode;
  showInput?: boolean;
} & PublicAddressDoublet;

const TokenBadge: React.FC<Props> = props => {
  const {
    actionButton,
    chainCode,
    input,
    tokenCode,
    publicAddress,
    showInput,
  } = props;
  return (
    <Badge show={true} type={BADGE_TYPES.WHITE}>
      <div className={classes.container}>
        <div className={classes.addressContainer}>
          <p className="boldText">{tokenCode}</p>
          <p className={classes.subtitle}>
            Chain Code: <span className="boldText">{chainCode}</span>
          </p>
          {showInput ? (
            input
          ) : (
            <p className={classes.publicAddressItem}>{publicAddress}</p>
          )}
        </div>
        {actionButton}
      </div>
    </Badge>
  );
};

export default TokenBadge;
