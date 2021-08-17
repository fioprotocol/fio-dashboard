import React from 'react';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import { BundledTransactionType } from '../types';
import classes from './ComponentsStyles.module.scss';

const BundledTransactionBadge: React.FC<BundledTransactionType> = props => {
  const { bundles, remaining = 0 } = props;
  return (
    <Badge show={true} type={BADGE_TYPES.BLACK}>
      <div className={classes.bundledContainer}>
        <p className={classes.title}>Bundle Transaction Amount</p>
        <p className={classes.total}>
          <span className="boldText">{bundles} Bundles</span>
          <span className={classes.remaining}> ({remaining} Remaining)</span>
        </p>
      </div>
    </Badge>
  );
};

export default BundledTransactionBadge;
