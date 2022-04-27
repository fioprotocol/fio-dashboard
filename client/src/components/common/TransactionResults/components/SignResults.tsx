import React from 'react';
import classnames from 'classnames';

import Results from '../index';
import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import FioName from '../../FioName/FioName';

import { ResultsProps } from '../types';

import classes from '../styles/Results.module.scss';

const SignResults: React.FC<ResultsProps> = props => {
  const {
    results: {
      name,
      other: { chainCode, contractAddress, tokenId, url, hash, creatorUrl },
    },
  } = props;
  const dashSign = ' - ';

  return (
    <Results {...props}>
      <FioName name={name || ''} />
      <h5 className={classes.label}>Signed NFT Details</h5>
      <div className={classes.badges}>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.badgeContainer}>
            <p className={classes.badgeItem}>Chain Code</p>
            <p className={classes.badgeItemNext}>{chainCode}</p>
          </div>
        </Badge>
        <div className={classes.statusBadge}>
          <Badge show={true} type={BADGE_TYPES.WHITE}>
            <div className={classes.badgeContainer}>
              <span className={classes.badgeItem}>Token ID</span>
              <span className={classes.badgeItemNext}>
                {tokenId || dashSign}
              </span>
            </div>
          </Badge>
        </div>
      </div>
      <div className={classes.badges}>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.badgeContainer}>
            <span className={classes.badgeItem}>Contract Address</span>
            <span className={classes.badgeItemNext}>{contractAddress}</span>
          </div>
        </Badge>
      </div>
      <div className={classes.badges}>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.badgeContainer}>
            <span className={classes.badgeItem}>URL</span>
            <span className={classes.badgeItemNext}>{url || dashSign}</span>
          </div>
        </Badge>
      </div>
      <div className={classes.badges}>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.badgeContainer}>
            <span className={classes.badgeItem}>Hash</span>
            <span
              className={classnames(classes.badgeItemNext, classes.breakWord)}
            >
              {hash || dashSign}
            </span>
          </div>
        </Badge>
      </div>
      <div className={classes.badges}>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.badgeContainer}>
            <span className={classes.badgeItem}>Creator URL</span>
            <span className={classes.badgeItemNext}>
              {creatorUrl || dashSign}
            </span>
          </div>
        </Badge>
      </div>
    </Results>
  );
};

export default SignResults;
