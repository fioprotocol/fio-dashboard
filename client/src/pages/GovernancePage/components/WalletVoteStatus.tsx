import { FC } from 'react';

import classnames from 'classnames';

import classes from '../styles/WalletVoteStatus.module.scss';
import { QuestionTooltip } from '../../../components/QuestionTooltip';

export type WalletVoteStatusProps = {
  name?: string;
  vote: boolean | 'proxied';
};

export const WalletVoteStatus: FC<WalletVoteStatusProps> = ({ name, vote }) => {
  return (
    <div className={classes.vote}>
      {name && <p className={classes.voteName}>{name}</p>}
      <p
        className={classnames(classes.voteStatus, {
          [classes.voteStatusVoted]: vote === true,
          [classes.voteStatusNotVoted]: vote === false,
          [classes.voteStatusProxied]: vote === 'proxied',
        })}
      >
        {vote === 'proxied' ? 'PROXIED' : vote ? 'VOTED' : 'NOT VOTED'}
      </p>
      {vote === 'proxied' && (
        <QuestionTooltip placement="top-end">
          <span>
            If you proxy your tokens, they count towards your proxy's vote, not
            your own. Staked tokens may be automatically proxied. To stop
            proxying,&nbsp;
            <a className={classes.questionLink} href="https://">
              vote for block producers
            </a>
            .
          </span>
        </QuestionTooltip>
      )}
    </div>
  );
};
