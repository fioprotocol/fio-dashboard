import { FC } from 'react';
import { Link } from 'react-router-dom';

import { BADGE_TYPES } from '../../../../../../components/Badge/Badge';

import { ROUTES } from '../../../../../../constants/routes';

import { InfoBadgeComponent } from '../../../InfoBadgeComponent/InfoBadgeComponent';

import classes from './ProxyVoteDetails.module.scss';

type Props = {
  power: number;
  name: string;
  handle: string;
  hasDetails: boolean;
};

export const ProxyVoteDetails: FC<Props> = ({
  power,
  name,
  handle,
  hasDetails,
}) => {
  return (
    <>
      <InfoBadgeComponent
        type={BADGE_TYPES.INFO}
        title="Proxied"
        message={
          <>
            Your tokens for this wallet are proxied. They count towards your
            proxy's vote, not your own. To stop proxying,{' '}
            <Link
              to={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}
              className={classes.infoBadgeLink}
            >
              vote for block producers
            </Link>
            .
          </>
        }
      />
      <h5 className={classes.proxyDetailsTitle}>Your Proxy</h5>
      {(name || handle) && (
        <div className={classes.detailsContainer}>
          {name && <p className={classes.detailsItem}>{name}</p>}
          {handle && (
            <p className={classes.detailsItem}>
              <span>FIO Handle:</span>
              <span>{handle}</span>
            </p>
          )}
        </div>
      )}
      {hasDetails && (
        <h5 className={classes.proxyDetailsSubTitle}>Proxy Vote Details</h5>
      )}
      {power === 0 && (
        <InfoBadgeComponent
          type={BADGE_TYPES.ERROR}
          title="Not Voting Tokens"
          message="This proxy is voting for 0 FIO Foundation Board of Directors"
        />
      )}
    </>
  );
};
