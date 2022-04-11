import React from 'react';

import Results from '../index';
import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import DomainStatusBadge from '../../../Badges/DomainStatusBadge/DomainStatusBadge';

import { ResultsProps } from '../types';

import classes from '../styles/Results.module.scss';

const SetVisibilityResults: React.FC<ResultsProps> = props => {
  const {
    results: { name, changedStatus },
  } = props;
  return (
    <Results {...props}>
      <h5 className={classes.label}>Status Change Information</h5>
      <div className={classes.badges}>
        <div className={classes.nameBadge}>
          <Badge show={true} type={BADGE_TYPES.WHITE}>
            <div className={classes.badgeContainer}>
              <p className={classes.badgeItem}>Domain</p>
              <p className={classes.badgeItemNext}>{name}</p>
            </div>
          </Badge>
        </div>
        <div className={classes.statusBadge}>
          <Badge show={true} type={BADGE_TYPES.WHITE}>
            <div className={classes.badgeContainer}>
              <p className={classes.badgeItem}>New Status</p>
              <div className={classes.badgeItemNext}>
                <DomainStatusBadge status={changedStatus || ''} />
              </div>
            </div>
          </Badge>
        </div>
      </div>
    </Results>
  );
};

export default SetVisibilityResults;
