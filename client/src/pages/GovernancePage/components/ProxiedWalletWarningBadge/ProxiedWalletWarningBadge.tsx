import React from 'react';
import { Link } from 'react-router-dom';

import { InfoBadgeComponent } from '../InfoBadgeComponent/InfoBadgeComponent';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { ROUTES } from '../../../../constants/routes';

import classes from './ProxiedWalletWarningBadge.module.scss';

export const ProxiedWalletWarningBadge: React.FC = () => {
  return (
    <InfoBadgeComponent
      className={classes.badge}
      title="Cannot Cast Vote"
      type={BADGE_TYPES.ERROR}
      message={
        <>
          This wallet is currently proxying its votes. You must first{' '}
          <Link to={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}>
            vote on block producers
          </Link>{' '}
          with this wallet before you can vote on FIO Board Members.
        </>
      }
    />
  );
};
