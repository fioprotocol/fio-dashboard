import React from 'react';

import Badge, { BADGE_TYPES } from '../../../Badge/Badge';

import { ResultsProps } from '../types';

import classes from '../Results.module.scss';
import { SET_VISIBILITY_REQUEST } from '../../../../redux/fio/actions';
import DomainStatusBadge from '../../../Badges/DomainStatusBadge/DomainStatusBadge';

const SetVisibilityResults = (props: ResultsProps) => {
  if (props.actionName !== SET_VISIBILITY_REQUEST) return null;
  const {
    results: { name, changedStatus },
  } = props;
  return (
    <>
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
                <DomainStatusBadge status={changedStatus} />
              </div>
            </div>
          </Badge>
        </div>
      </div>
    </>
  );
};

export default SetVisibilityResults;
