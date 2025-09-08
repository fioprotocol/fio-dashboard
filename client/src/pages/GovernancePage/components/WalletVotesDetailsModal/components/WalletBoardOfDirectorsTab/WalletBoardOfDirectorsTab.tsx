import React from 'react';
import { Link } from 'react-router-dom';

import Loader from '../../../../../../components/Loader/Loader';
import { useGetPublicKeyCandidatesVotes } from '../../../../../../hooks/governance';
import {
  CandidateProps,
  OverviewWallet,
} from '../../../../../../types/governance';
import { BADGE_TYPES } from '../../../../../../components/Badge/Badge';
import Amount from '../../../../../../components/common/Amount';

import classes from './WalletBoardOfDirectorsTab.module.scss';
import { ProxyVoteDetails } from '../ProxyVoteDetails';
import { MemberBadge } from '../../../MemberBadge/MemberBadge';
import { CandidateIdBadge } from '../../../CandidateIdBadge/CandidateIdBadge';
import { MyVoteDetails } from '../MyVoteDetails';
import { InfoBadgeComponent } from '../../../InfoBadgeComponent/InfoBadgeComponent';
import { ScrollBar } from '../ScrollBar/ScrollBar';

import { ROUTES } from '../../../../../../constants/routes';

import noImageIconSrc from '../../../../../../assets/images/no-photo.svg';

import {
  getNextGovernanceDate,
  voteFormatDate,
} from '../../../../../../util/general';

import { DetailedProxy } from '../../../../../../types';

type Props = {
  activeWallet: OverviewWallet;
  proxy: DetailedProxy;
  listOfCandidates: CandidateProps[];
};

export const WalletBoardOfDirectorsTab: React.FC<Props> = props => {
  const { activeWallet, listOfCandidates, proxy } = props;

  const { loading, candidatesVotes } = useGetPublicKeyCandidatesVotes({
    proxyPublicKey: activeWallet.proxyVotes?.publicKey,
    publicKey: activeWallet?.publicKey,
  });

  if (loading) {
    return <Loader />;
  }

  const lastVote = getNextGovernanceDate({
    returnLastVoteDate: true,
    returnDefaultFormat: true,
  });

  const candidates = candidatesVotes?.candidatesList?.map(candidate => {
    const candidateFromCurrentList = listOfCandidates.find(
      listCandidate => listCandidate.id === candidate.id,
    );

    if (!candidateFromCurrentList) return candidate;

    return candidateFromCurrentList;
  });

  return (
    <>
      {activeWallet?.hasProxy ? (
        <ProxyVoteDetails
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
      {!activeWallet?.hasProxy && (
        <InfoBadgeComponent
          type={BADGE_TYPES.INFO}
          title="Your Last Vote Count Power"
          message=" If you have recently voted, your vote will show up after the next vote count date."
        />
      )}

      {candidates?.length ? (
        <div className={classes.scrollArea}>
          <ScrollBar>
            <div className={classes.tabsScrollContainer}>
              {candidates.map(
                ({
                  id,
                  image,
                  name,
                  lastVoteCount,
                  lastVoteUpdate,
                  status,
                }) => (
                  <div className={classes.directorContainer} key={id}>
                    <div className={classes.contentContainer}>
                      <div className={classes.dataContainer}>
                        <img
                          src={image}
                          alt={`candidate ${id}`}
                          className={`${classes.img} ${
                            image === noImageIconSrc ? classes.withoutPhoto : ''
                          }`}
                        />
                        <div className={classes.nameContainer}>
                          <p className={classes.name}>{name}</p>
                          <p className={classes.lastVoted}>
                            Last Vote Count:{' '}
                            <span>
                              {lastVoteUpdate !== null
                                ? voteFormatDate(new Date(lastVoteUpdate))
                                : 'N/A'}
                            </span>
                          </p>
                          <p className={classes.lastVoted}>
                            Last Vote Count Power:{' '}
                            <span>
                              <Amount>{lastVoteCount}</Amount>
                            </span>
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
          </ScrollBar>
        </div>
      ) : (
        <InfoBadgeComponent
          type={BADGE_TYPES.ERROR}
          title="Not Voting Tokens"
          message={
            activeWallet?.hasProxy ? (
              'This proxy is voting for 0 FIO Foundation Board of Directors'
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
    </>
  );
};
