import React from 'react';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import { NFTTokenDoublet } from '../../../types';
import classes from './TokenBadge.module.scss';

type Props = {
  actionButton?: React.ReactNode;
} & NFTTokenDoublet;

const NFTTokenBadge: React.FC<Props> = props => {
  const { actionButton, chainCode, tokenId, publicAddress } = props;
  return (
    <Badge show={true} type={BADGE_TYPES.WHITE}>
      <div className={classes.container}>
        <div className={classes.addressContainer}>
          <div className={classes.subtitle}>
            Chain Code: <span className="boldText">{chainCode}</span>
          </div>
          <div className={classes.subtitle}>
            Token ID: <span className="boldText">{tokenId}</span>
          </div>
          <div className={classes.subtitle}>
            Contract Address: <span className="boldText">{publicAddress}</span>
          </div>
        </div>
        {actionButton}
      </div>
    </Badge>
  );
};

export default NFTTokenBadge;
