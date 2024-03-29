import React from 'react';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import classes from './BundledTransactionBadge.module.scss';

type Props = {
  bundles: number;
  remaining: number;
  hideRemaining?: boolean;
};

const BundledTransactionBadge: React.FC<Props> = props => {
  const { bundles, remaining = 0, hideRemaining = false } = props;
  return (
    <Badge show={true} type={BADGE_TYPES.BLACK}>
      <div className={classes.bundledContainer}>
        <p className={classes.title}>Bundled Transaction Amount</p>
        <p className={classes.total}>
          <span className="boldText">{bundles} Bundles</span>
          {hideRemaining ? null : (
            <span className={classes.remaining}> ({remaining} Remaining)</span>
          )}
        </p>
      </div>
    </Badge>
  );
};

export default BundledTransactionBadge;
