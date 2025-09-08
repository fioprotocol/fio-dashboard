import React from 'react';
import { Link } from 'react-router-dom';

import { InfoBadgeComponent } from '../../../InfoBadgeComponent/InfoBadgeComponent';
import { BADGE_TYPES } from '../../../../../../components/Badge/Badge';

import { ProxyVoteDetails } from '../ProxyVoteDetails';
import { MyVoteDetails } from '../MyVoteDetails';

import { GradeBadge } from '../../../GradeBadge/GradeBadge';
import { ScrollBar } from '../ScrollBar/ScrollBar';

import { ROUTES } from '../../../../../../constants/routes';

import apis from '../../../../../../api';
import MathOp from '../../../../../../util/math';

import { DetailedProxy } from '../../../../../../types';
import {
  BlockProducersItemProps,
  OverviewWallet,
} from '../../../../../../types/governance';

import classes from './WalletBlockProducersTab.module.scss';

type Props = {
  activeWallet: OverviewWallet;
  listOfBlockProducers: BlockProducersItemProps[];
  proxy: DetailedProxy;
};

export const WalletBlockProducersTab: React.FC<Props> = props => {
  const { activeWallet, listOfBlockProducers, proxy } = props;

  // Calculate total voting power from all votes
  const votingPower = apis.fio.sufToAmount(
    activeWallet?.votes?.reduce(
      (acc, vote) => new MathOp(acc).add(vote.lastVoteWeight).toString(),
      '0',
    ) || '0',
  );

  const votes = activeWallet?.proxyVotes?.votes || activeWallet?.votes;

  const producers = [...new Set(votes.map(vote => vote.producers).flat())];

  return (
    <div>
      {activeWallet?.hasProxy ? (
        <ProxyVoteDetails
          name={proxy?.owner}
          handle={proxy?.fioAddress}
          hasDetails={true}
        />
      ) : (
        <MyVoteDetails power={votingPower} />
      )}
      {producers.length > 0 ? (
        <div className={classes.scrollArea}>
          <ScrollBar>
            <div className={classes.tabsScrollContainer}>
              {listOfBlockProducers
                .filter(blockProducerItem =>
                  producers.includes(blockProducerItem.owner),
                )
                .map(
                  ({
                    defaultLogo,
                    fioAddress,
                    flagIconUrl,
                    grade,
                    isTop21,
                    name,
                    links,
                    logo,
                    owner,
                  }) => (
                    <div className={classes.container} key={owner}>
                      <div className={classes.headerContainer}>
                        <img
                          src={logo || defaultLogo}
                          alt="Block Producer"
                          className={classes.logo}
                        />
                        <div className={classes.nameContainer}>
                          <h4 className={classes.name}>{name}</h4>
                          <p className={classes.details}>{fioAddress}</p>
                        </div>
                      </div>
                      <div className={classes.dataContainer}>
                        {flagIconUrl ? (
                          <img
                            src={flagIconUrl}
                            alt="flag"
                            className={classes.flag}
                          />
                        ) : null}
                        <div className={classes.linksContainer}>
                          {links.map(({ logo, url }) => (
                            <div className={classes.linkItem} key={logo}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img alt="logo" src={logo} />
                              </a>
                            </div>
                          ))}
                        </div>
                        <div className={classes.gradeContainer}>
                          <GradeBadge grade={grade} />
                          {isTop21 ? (
                            <div className={classes.topScore}>TOP 21</div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ),
                )}
            </div>
          </ScrollBar>
        </div>
      ) : (
        <InfoBadgeComponent
          type={BADGE_TYPES.ERROR}
          title="Not Voting Tokens "
          message={
            activeWallet?.hasProxy ? (
              'This proxy is voting for the following 0 producers'
            ) : (
              <>
                You are not voting the tokens in this wallet.{' '}
                <Link to={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}>
                  Go Vote Your Tokens
                </Link>
              </>
            )
          }
        />
      )}
    </div>
  );
};
