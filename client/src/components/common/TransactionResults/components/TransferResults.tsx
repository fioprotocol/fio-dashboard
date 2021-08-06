import React from 'react';

import Badge, { BADGE_TYPES } from '../../../Badge/Badge';

import { ResultsProps } from '../types';

import classes from '../Results.module.scss';
import { TRANSFER_REQUEST } from '../../../../redux/fio/actions';
import { fioNameLabels } from '../../../../constants/labels';

const TransferResults = (props: ResultsProps) => {
  if (props.actionName !== TRANSFER_REQUEST) return null;
  const {
    pageName,
    results: { name, publicKey },
  } = props;
  const fioNameLabel = fioNameLabels[pageName];
  return (
    <>
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
    </>
  );
};

export default TransferResults;
