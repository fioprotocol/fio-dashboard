import { FC } from 'react';

import { Link } from 'react-router-dom';

import { BADGE_TYPES } from '../../../../../../components/Badge/Badge';

import { InfoBadgeComponent } from '../../../InfoBadgeComponent/InfoBadgeComponent';

import { ROUTES } from '../../../../../../constants/routes';

import { voteFormatDate } from '../../../../../../util/general';

import classes from './MyVoteDetails.module.scss';

type Props = {
  powerLabelSuffix?: string;
  power: string | number;
  lastVote?: string;
  lastUpdated?: string;
};

export const MyVoteDetails: FC<Props> = ({
  powerLabelSuffix,
  power,
  lastVote,
  lastUpdated,
}) => {
  return (
    <>
      <div className={classes.detailsContainer}>
        {lastVote && (
          <p className={classes.detailsItem}>
            <span className={classes.detailsLabel}>Last Board Vote:</span>
            <span className={classes.detailsValue}>
              {voteFormatDate(new Date(lastVote))}
            </span>
          </p>
        )}
        <p className={classes.detailsItem}>
          <span className={classes.detailsLabel}>
            Current&nbsp;{powerLabelSuffix ? <>Board&nbsp;</> : ''}Voting Power:
          </span>
          <span className={classes.detailsValue}>
            {power?.toLocaleString('en', {
              minimumFractionDigits: 4,
            }) || 0}
            &nbsp;FIO
          </span>
        </p>
        {lastUpdated && (
          <p className={classes.detailsItem}>
            <span className={classes.detailsLabel}>
              Board Voting Power Last Updated:
            </span>
            <span className={classes.detailsValue}>
              {voteFormatDate(new Date(lastUpdated))}
            </span>
          </p>
        )}
      </div>
      {power === 0 && (
        <InfoBadgeComponent
          type={BADGE_TYPES.ERROR}
          title="Not Voting Tokens "
          message={
            <>
              You are not voting the tokens in this wallet.&nbsp;
              <Link
                to={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}
                className={classes.infoBadgeLink}
              >
                Go Vote Your Tokens
              </Link>
            </>
          }
        />
      )}
    </>
  );
};
