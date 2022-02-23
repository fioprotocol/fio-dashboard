import React from 'react';

import Results from '../index';
import { BADGE_TYPES } from '../../../Badge/Badge';
import PriceBadge from '../../../Badges/PriceBadge/PriceBadge';

import { ResultsProps } from '../types';

import classes from '../styles/Results.module.scss';

const RenewResults = (props: ResultsProps) => {
  const {
    results: {
      name,
      feeCollected: { nativeFio, fio, usdc } = {
        native: 0,
        costFio: '0',
        costUsdc: '0',
      },
    },
  } = props;
  return (
    <Results {...props}>
      <h5 className={classes.label}>Renew Details</h5>
      <PriceBadge
        costNativeFio={nativeFio}
        costFio={fio}
        costUsdc={usdc}
        title={name}
        type={BADGE_TYPES.WHITE}
      />
    </Results>
  );
};

export default RenewResults;
