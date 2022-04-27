import React from 'react';

import Results from '../../';
import Badge, { BADGE_TYPES } from '../../../../Badge/Badge';

import { fioNameLabels } from '../../../../../constants/labels';

import { ResultsProps } from '../../types';

import classes from '../../styles/Results.module.scss';

type TransferResultsProps = {
  resetFioNames: () => void;
};

const TransferResults: React.FC<ResultsProps &
  TransferResultsProps> = props => {
  const {
    pageName,
    results: { name, publicKey },
    resetFioNames,
  } = props;
  const fioNameLabel = fioNameLabels[pageName || ''];
  const onClose = () => {
    resetFioNames();
    props.onClose();
  };

  return (
    <Results {...props} onClose={onClose}>
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
