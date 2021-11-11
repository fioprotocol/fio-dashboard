import React from 'react';

import Results from '../index';
import Badge, { BADGE_TYPES } from '../../../Badge/Badge';

import { fioNameLabels } from '../../../../constants/labels';

import { ResultsProps } from '../types';

import classes from '../Results.module.scss';

const TransferResults = (props: ResultsProps) => {
  const {
    pageName,
    results: { name, publicKey },
  } = props;
  const fioNameLabel = fioNameLabels[pageName];
  return (
    <Results {...props}>
      <p className={classes.label}>Transfer Information</p>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classes.badgeContainer}>
          <p className={classes.title}>{fioNameLabel}</p>
          <p className={classes.item}>{name}</p>
        </div>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classes.badgeContainer}>
          <p className={classes.title}>Public Key</p>
          <p className={classes.item}>{publicKey}</p>
        </div>
      </Badge>
    </Results>
  );
};

export default TransferResults;
