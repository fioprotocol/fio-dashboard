import React from 'react';

import Loader from '../../../../../../components/Loader/Loader';
import { useGetPublicKeyCandidatesVotes } from '../../../../../../hooks/governance';
import {
  CandidateProps,
  OverviewWallet,
} from '../../../../../../types/governance';
import { BADGE_TYPES } from '../../../../../../components/Badge/Badge';

import classes from './WalletBoardOfDirectorsTab.module.scss';
import { ProxyVoteDetails } from '../ProxyVoteDetails';
import { MemberBadge } from '../../../MemberBadge/MemberBadge';
import { CandidateIdBadge } from '../../../CandidateIdBadge/CandidateIdBadge';
import { MyVoteDetails } from '../MyVoteDetails';
import { InfoBadgeComponent } from '../../../InfoBadgeComponent/InfoBadgeComponent';

import {
  getNextGovernanceDate,
  voteFormatDate,
} from '../../../../../../util/general';
import apis from '../../../../../../api';
import { DetailedProxy } from '../../../../../../types';

type Props = {
  activeWallet: OverviewWallet;
  proxy: DetailedProxy;
  listOfCandidates: CandidateProps[];
};

export const WalletBoardOfDirectorsTab: React.FC<Props> = props => {
  const { activeWallet, listOfCandidates, proxy } = props;
  const { loading, candidatesVotes } = useGetPublicKeyCandidatesVotes(
    activeWallet?.publicKey,
  );

  if (loading) {
    return <Loader />;
  }

  const lastVote = getNextGovernanceDate({
    returnLastVoteDate: true,
    returnDefaultFormat: true,
  });

  return (
    <>
      {activeWallet?.hasProxy ? (
        <ProxyVoteDetails
          power={apis.fio.sufToAmount(activeWallet?.available)}
          name={proxy?.owner}
          handle={proxy?.fioAddress}
          hasDetails
        />
      ) : (
        <MyVoteDetails
          powerLabelSuffix="Board"
          power={candidatesVotes?.currentBoardVotingPower}
          lastVote={lastVote}
          lastUpdated={candidatesVotes?.boardVotingPowerLastUpdate}
        />
      )}
      {!activeWallet?.hasVotedForBoardOfDirectors && (
        <InfoBadgeComponent
          type={BADGE_TYPES.INFO}
          title="Your Last Vote Count Power"
          message="If you have vote recently, please note that your vote will show up after the next count date."
        />
      )}
      {activeWallet?.available > 0 && (
        <div className={classes.tabsScrollContainer}>
          {listOfCandidates
            .filter(candidateItem =>
              candidatesVotes?.candidatesIdsList?.includes(candidateItem.id),
            )
            .map(
              ({ id, image, name, lastVoteCount, lastVoteUpdate, status }) => (
                <div className={classes.directorContainer} key={id}>
                  <div className={classes.contentContainer}>
                    <div className={classes.dataContainer}>
                      <img
                        src={image}
                        alt={`candidate ${id}`}
                        className={classes.img}
                      />
                      <div className={classes.nameContainer}>
                        <p className={classes.name}>{name}</p>
                        <p className={classes.lastVoted}>
                          Last Vote Count:
                          <span>
                            {voteFormatDate(new Date(lastVoteUpdate))}
                          </span>
                        </p>
                        <p className={classes.lastVoted}>
                          Last Vote Count Power: <span>{lastVoteCount}</span>
                        </p>
                      </div>
                    </div>
                    <div className={classes.itemActionContainer}>
                      <MemberBadge status={status} />
                      <CandidateIdBadge
                        id={id}
                        className={classes.candidateBadge}
                      />
                    </div>
                  </div>
                </div>
              ),
            )}
        </div>
      )}
    </>
  );
};
