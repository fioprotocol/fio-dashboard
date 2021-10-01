import React from 'react';

import Badge, { BADGE_TYPES } from '../../../Badge/Badge';

import { ResultsProps } from '../types';

import classes from '../Results.module.scss';
import { FIO_SIGN_NFT_REQUEST } from '../../../../redux/fio/actions';

const SignResults = (props: ResultsProps) => {
  if (props.actionName !== FIO_SIGN_NFT_REQUEST) return null;
  const {
    results: {
      name,
      other: { chainCode, contractAddress },
    },
  } = props;
  return (
    <>
      <h5 className={classes.label}>Details</h5>
      <div className={classes.badges}>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.badgeContainer}>
            <p className={classes.badgeItem}>FIO Address</p>
            <p className={classes.badgeItemNext}>{name}</p>
          </div>
        </Badge>
        <div className={`${classes.statusBadge} ml-4`}>
          <Badge show={true} type={BADGE_TYPES.WHITE}>
            <div className={classes.badgeContainer}>
              <span className={classes.badgeItem}>Chain Code</span>
              <span className={classes.badgeItemNext}>{chainCode}</span>
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
    </>
  );
};

export default SignResults;
