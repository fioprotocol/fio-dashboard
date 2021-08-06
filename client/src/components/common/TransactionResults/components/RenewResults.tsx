import React from 'react';

import { BADGE_TYPES } from '../../../Badge/Badge';

import { ResultsProps } from '../types';

import classes from '../Results.module.scss';
import { RENEW_REQUEST } from '../../../../redux/fio/actions';
import PriceBadge from '../../../Badges/PriceBadge/PriceBadge';

const RenewResults = (props: ResultsProps) => {
  if (props.actionName !== RENEW_REQUEST) return null;
  const {
    results: {
      name,
      feeCollected: { costFio, costUsdc },
    },
  } = props;
  return (
    <>
      <h5 className={classes.label}>Renew Details</h5>
      <PriceBadge
        costFio={costFio}
        costUsdc={costUsdc}
        title={name}
        type={BADGE_TYPES.WHITE}
      />
    </>
  );
};

export default RenewResults;
