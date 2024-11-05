import { FC } from 'react';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Loader from '../../../../components/Loader/Loader';
import ModalComponent from '../../../../components/Modal/Modal';
import { CheckBox } from '../../../../components/common/CheckBox/CheckBox';

import { MyCurrentVotes } from '../MyCurrentVotes';
import { BoardOfDirectorsDetails } from '../BoardOfDirectorsDetails';
import { MemberBadge } from '../MemberBadge/MemberBadge';
import { CandidateIdBadge } from '../CandidateIdBadge/CandidateIdBadge';
import { NoAssociatedFioHandlesWarningBadge } from '../NoAssociatedFioHandlesWarningBadge/NoAssociatedFioHandlesWarningBadge';

import { useContext } from './BoardOfDirectorsTabContext';

import classes from './BoardOfDirectorsTab.module.scss';
import { GovernancePageContextProps } from '../../types';

export const BoardOfDirectorsTab: FC<GovernancePageContextProps> = props => {
  const { listOfCandidates, loading, onCandidateSelectChange } = props;

  const {
    activeCandidate,
    disabledCastBoardVote,
    nextDate,
    showCandidateDetailsModal,
    onCloseModal,
    handleCandidateDetailsModalOpen,
    handleCastVote,
  } = useContext({ listOfCandidates });

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <h5 className={classes.title}>Next Election Date</h5>
        <h5 className={classes.date}>{nextDate}</h5>
      </div>
      <p className={classes.text}>
        FIO Foundation is a Cayman non-profit foundation managed by a Board
        consisting of up to 9 members elected by FIO Token Holders.
      </p>

      <div className={classes.tilesContainer}>
        <MyCurrentVotes />
        <div className={classes.tileItemContainer}>
          <h5 className={classes.title}>Current Board of Directors</h5>
          <a
            href="https://fio.net/discover/people"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            <SubmitButton className={classes.button} text="View" />
          </a>
        </div>
      </div>

      <div className={classes.actionContainer}>
        <div className={classes.actionTitleContainer}>
          <h3 className={classes.title}>Upcoming Election Candidates</h3>
          <p className={classes.text}>
            Vote for up to 8 candidates. Note: If your vote contains more
            candidates, only the first 8 will be considered.
          </p>
        </div>
        <SubmitButton
          text="Cast Vote"
          onClick={handleCastVote}
          disabled={disabledCastBoardVote}
          className={classes.actionButton}
        />
      </div>
      <NoAssociatedFioHandlesWarningBadge show={disabledCastBoardVote} />
      <div className={classes.listContainer}>
        {!loading ? (
          listOfCandidates.map(candidateItem => {
            const { id, image, lastVoteCount, name, status } = candidateItem;

            return (
              <div className={classes.itemContainer} key={id}>
                <CheckBox onChange={() => onCandidateSelectChange(id)} />
                <div className={classes.contentContainer}>
                  <div className={classes.dataContainer}>
                    <img
                      src={image}
                      alt={`candidate ${id}`}
                      className={classes.img}
                    />
                    <div className={classes.nameContainer}>
                      <p className={classes.name}>{name}</p>
                      <p className={classes.lastVotedCount}>
                        Last Vote Count: <span>{lastVoteCount}</span>
                      </p>
                    </div>
                  </div>
                  <div className={classes.itemActionContainer}>
                    <MemberBadge status={status} />
                    <CandidateIdBadge id={id} />
                    <SubmitButton
                      text="View"
                      onClick={() =>
                        handleCandidateDetailsModalOpen(candidateItem)
                      }
                      className={classes.itemButton}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <Loader />
        )}
      </div>
      <SubmitButton
        text="Cast Vote"
        onClick={handleCastVote}
        disabled={disabledCastBoardVote}
        className={classes.button}
        withTopMargin
      />
      <ModalComponent
        show={showCandidateDetailsModal}
        closeButton
        hasDefaultCloseColor
        onClose={onCloseModal}
        classNames={{ dialog: classes.modal, content: classes.content }}
      >
        <BoardOfDirectorsDetails activeCandidate={activeCandidate} />
      </ModalComponent>
    </div>
  );
};
