import { FC } from 'react';

import classes from '../styles/GovernanceVotingHelpTab.module.scss';
import { BADGE_TYPES } from '../../../components/Badge/Badge';
import InfoBadge from '../../../components/InfoBadge/InfoBadge';

export const GovernanceVotingHelpTab: FC = () => {
  return (
    <>
      <h3 className={classes.title}>Voting Overview</h3>
      <p className={classes.description}>
        FIO Chain is a fully decentralized public Delegated Proof of Stake
        (DPoS) blockchain. The FIO Token holders decide which Block Producers
        should secure the network by delegating (voting) their tokens. In
        addition, FIO Token can vote on FIO Foundation Board members. The FIO
        Foundation facilitates the growth and adoption of the FIO Protocol, and
        the Board of Directors set the Foundation’s strategy.
      </p>
      <h3 className={classes.title}>How to Vote for Block Producers</h3>
      <div className={classes.block}>
        <h4 className={classes.subtitle}>Vote Directly</h4>
        <p className={classes.content}>
          Once you’ve had the opportunity to do your own research on the FIO
          Block producers, you simply select up to 30 Block producers to cast
          your vote for.&nbsp;
          <a href="https://fio.net/fio-chain/block-producers">
            Want to know more about Block Producers?
          </a>
          <a className={classes.blockLink} href="https://">
            Vote for Block Producers
          </a>
        </p>
        <h4 className={classes.subtitle}>Vote Via Proxy</h4>
        <p className={classes.content}>
          If you don’t have time to research Block Producers, you can proxy your
          vote to another entity and let them vote on your behalf. Don’t be
          surprised if you see that your tokens are already proxied. FIO Chain
          may automatically proxy tokens to the wallet operator for users who do
          not actively vote themselves. The idea is that those operators may
          best represent the interests of their users. To withdraw the automatic
          proxy, just vote or proxy yourself.
          <a
            className={classes.blockLink}
            href="https://www.figma.com/design/UzJyp5DM8xvfWRI4Iy44hU/New-FIO-Design-Concepts?node-id=201-18221&t=yGn8pNnbXgwkBwJm-4"
          >
            Proxy Your Vote
          </a>
        </p>
      </div>
      <h3 className={classes.title}>How to Vote for the Board of Directors</h3>
      <div className={classes.block}>
        <h4 className={classes.subtitle}>Vote Directly</h4>
        <p className={classes.content}>
          <InfoBadge
            className={classes.infoBadge}
            type={BADGE_TYPES.INFO}
            show={true}
            title="Proxied Tokens"
            message={
              <>
                If you are proxying your tokens they will be counted towards
                your proxies vote weight and your direct Board vote will be
                ignored! Remember that if you staked your tokens they may have
                been automatically proxied. To stop proxying, you must&nbsp;
                <a href="https://" className={classes.infoBadgeLink}>
                  vote for Block Producers
                </a>
                .
              </>
            }
          />
          Once you’ve had the opportunity to do your own research on the Board
          of Directors, you simply cast your vote via FIO Request.
          <a
            className={classes.blockLink}
            href="https://www.figma.com/design/UzJyp5DM8xvfWRI4Iy44hU/New-FIO-Design-Concepts?node-id=201-16181&t=yGn8pNnbXgwkBwJm-4"
          >
            Vote for the Board of Directors
          </a>
        </p>
      </div>
      <h3 className={classes.title}>How Votes are Counted</h3>
      <div className={classes.block}>
        <p className={classes.content}>
          <ul>
            <li>
              Your vote issue will be manually created and will show up in&nbsp;
              <a href="https://fioprotocol.atlassian.net/wiki/spaces/DAO/pages/521076846/Board+Vote+Tracking#Raw-Votes/">
                Board Vote Tracking | Raw Votes
              </a>
              &nbsp;including the voting power (Current weight in FIO). The
              issue may not be created until after the election day.
            </li>
            <li>
              Your voting power will be counted based on the number of FIO
              Tokens you held on the day of the election.
            </li>
            <li>If you are staking tokens they will be counted in voting.</li>
            <li>
              If your tokens are locked, they may not be counted based on the
              following criteria:
              <ul>
                <li>
                  Genesis locks
                  <ul>
                    <li>
                      Minimum 30% of initial grant is votable, rest is votable
                      after unlock
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="https://github.com/fioprotocol/fips/blob/master/fip-0006.md">
                    General locks
                  </a>
                  <ul>
                    <li>Votable if Can vote flag is set to 1</li>
                    <li>Otherwise locked tokens are not votable</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Unless you submit a new vote, your vote will continue to be
              counted at every election based on then current voting power.
            </li>
            <li>
              If you want to stop voting send a FIO Request with empty memo
              field.
            </li>
            <li>
              Results of elections will be posted here:&nbsp;
              <a href="https://fioprotocol.atlassian.net/wiki/spaces/DAO/pages/521076846/Board+Vote+Tracking">
                Board Vote Tracking
              </a>
            </li>
          </ul>
        </p>
      </div>
    </>
  );
};

export default GovernanceVotingHelpTab;
