import React from 'react';

import { ProxyVoteDetails } from '../ProxyVoteDetails';
import { MyVoteDetails } from '../MyVoteDetails';
import {
  BlockProducersItemProps,
  OverviewWallet,
} from '../../../../../../types/governance';

import { GradeBadge } from '../../../GradeBadge/GradeBadge';
import { ScrollBar } from '../ScrollBar/ScrollBar';

import apis from '../../../../../../api';

import { DetailedProxy } from '../../../../../../types';

import classes from './WalletBlockProducersTab.module.scss';

type Props = {
  activeWallet: OverviewWallet;
  listOfBlockProducers: BlockProducersItemProps[];
  proxy: DetailedProxy;
};

export const WalletBlockProducersTab: React.FC<Props> = props => {
  const { activeWallet, listOfBlockProducers, proxy } = props;

  const votingPower = apis.fio.sufToAmount(activeWallet?.balance);

  const producers = [
    ...new Set(activeWallet?.votes.map(vote => vote.producers).flat()),
  ];

  return (
    <div>
      {activeWallet?.hasProxy ? (
        <ProxyVoteDetails
          power={votingPower}
          name={proxy?.owner}
          handle={proxy?.fioAddress}
          hasDetails={true}
        />
      ) : (
        <MyVoteDetails power={votingPower} />
      )}
      <div className={classes.scrollArea}>
        {producers.length > 0 && (
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
        )}
      </div>
    </div>
  );
};
