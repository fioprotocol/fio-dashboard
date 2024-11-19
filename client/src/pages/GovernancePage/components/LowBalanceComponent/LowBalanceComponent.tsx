import React from 'react';

import LowBalanceBadge, {
  LowBalanceProps,
} from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';

import classes from './LowBalanceComponent.module.scss';

export const LowBalanceComponent: React.FC<LowBalanceProps> = props => (
  <LowBalanceBadge {...props} className={classes.lowBalanceBadge} />
);
