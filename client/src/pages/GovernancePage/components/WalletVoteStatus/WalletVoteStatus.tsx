import { FC } from 'react';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import classnames from 'classnames';

import { ROUTES } from '../../../../constants/routes';

import QuestionSvg from '../../../../assets/images/question.svg';

import classes from './WalletVoteStatus.module.scss';

export type WalletVoteStatusProps = {
  hasProxy: boolean;
  name?: string;
  vote: boolean;
};

export const WalletVoteStatus: FC<WalletVoteStatusProps> = ({
  name,
  hasProxy,
  vote,
}) => {
  return (
    <div className={classes.vote}>
      {name && <p className={classes.voteName}>{name}</p>}
      <p
        className={classnames(classes.voteStatus, {
          [classes.voteStatusVoted]: vote === true,
          [classes.voteStatusProxied]: hasProxy,
        })}
      >
        {hasProxy ? 'PROXIED' : vote ? 'VOTED' : 'NOT VOTED'}
      </p>
      {hasProxy && (
        <OverlayTrigger
          trigger={['hover', 'click']}
          placement="top-end"
          delay={1000}
          rootClose={false}
          defaultShow={false}
          overlay={
            <Tooltip id="question" className={classes.infoTooltip}>
              <span>
                If you proxy your tokens, they count towards your proxy's vote,
                not your own. Staked tokens may be automatically proxied. To
                stop proxying,{' '}
                <Link
                  className={classes.questionLink}
                  to={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}
                >
                  vote for block producers
                </Link>
                .
              </span>
            </Tooltip>
          }
        >
          <div className="d-flex">
            <img src={QuestionSvg} alt="question" className={classes.img} />
          </div>
        </OverlayTrigger>
      )}
    </div>
  );
};
