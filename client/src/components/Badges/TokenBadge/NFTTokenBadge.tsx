import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import { NFTTokenDoublet } from '../../../types';

import classes from './TokenBadge.module.scss';

type Props = {
  onClick: () => void;
} & NFTTokenDoublet;

const NFTTokenBadge: React.FC<Props> = props => {
  const { chainCode, tokenId, contractAddress, onClick } = props;

  return (
    <Badge show={true} type={BADGE_TYPES.WHITE}>
      <div
        className={classnames(classes.container, classes.isNft)}
        onClick={onClick}
      >
        <div className={classes.nftContainer}>
          <div className={classes.subtitle}>
            Chain Code: <span className="boldText">{chainCode}</span>
          </div>
          <div className={classes.subtitle}>
            Token ID: <span className="boldText">{tokenId}</span>
          </div>
          <div
            className={classnames(classes.subtitle, classes.contractAddress)}
          >
            Contract Address:{' '}
            <span className="boldText">{contractAddress}</span>
          </div>
        </div>
        <FontAwesomeIcon
          icon="chevron-right"
          className={classes.actionIcon}
          onClick={onClick}
        />
      </div>
    </Badge>
  );
};

export default NFTTokenBadge;
