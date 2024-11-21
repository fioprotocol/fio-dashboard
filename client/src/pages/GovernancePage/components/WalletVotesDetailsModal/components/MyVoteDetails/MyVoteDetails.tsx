import { FC } from 'react';

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
}) => (
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
      <div className={classes.detailsPowerContainer}>
        <p className={classes.detailsItem}>
          <span className={classes.detailsLabel}>
            Current {powerLabelSuffix ? <>Board </> : ''}Voting Power:
          </span>
          <span className={classes.detailsValue}>
            {power?.toLocaleString('en', {
              minimumFractionDigits: 4,
            }) || 0}{' '}
            FIO
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
    </div>
  </>
);
