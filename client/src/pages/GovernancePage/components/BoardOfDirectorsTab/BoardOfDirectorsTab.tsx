import { FC } from 'react';
import { Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Loader from '../../../../components/Loader/Loader';
import NotificationBadge from '../../../../components/NotificationBadge';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { ROUTES } from '../../../../constants/routes';
import { CANDIDATE_STATUS } from '../../../../constants/governance';

import { useContext } from './BoardOfDirectorsTabContext';

import { MyCurrentVotes } from '../MyCurrentVotes';

import noImageIconSrc from '../../../../assets/images/no-photo.svg';

import classes from './BoardOfDirectorsTab.module.scss';

export const BoardOfDirectorsTab: FC = () => {
  const {
    disabledCastBoardVote,
    listOfCandidates,
    loading,
    nextDate,
    onCheckBoxChange,
    handleCandidateDetailsModalOpen,
    handleCastVote,
  } = useContext();

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
      <NotificationBadge
        show={disabledCastBoardVote}
        title="No Associated FIO Handles"
        type={BADGE_TYPES.ERROR}
        message={
          <>
            You must have an associated FIO Handle in order to be able to send
            this request.{' '}
            <Link to={ROUTES.FIO_ADDRESSES_SELECTION} className={classes.link}>
              Please add one.
            </Link>
          </>
        }
        className={classes.notificationBadge}
      />
      <div className={classes.listContainer}>
        {!loading ? (
          listOfCandidates.map(candidateItem => {
            const { id, image, lastVoutCount, name, status } = candidateItem;

            return (
              <div className={classes.itemContainer} key={id}>
                <Checkbox
                  onChange={() => onCheckBoxChange(id)}
                  className={classes.checkbox}
                />
                <div className={classes.contentContainer}>
                  <div className={classes.dataContainer}>
                    <img
                      src={image || noImageIconSrc}
                      alt={`candidate ${id}`}
                      className={classnames(
                        classes.img,
                        !image && classes.withoutPhoto,
                      )}
                    />
                    <div className={classes.nameContainer}>
                      <p className={classes.name}>{name}</p>
                      <p className={classes.lastVotedCount}>
                        Last Vote Count: <span>{lastVoutCount}</span>
                      </p>
                    </div>
                  </div>
                  <div className={classes.itemActionContainer}>
                    <div
                      className={classnames(
                        classes.status,
                        status === CANDIDATE_STATUS.CANDIDATE &&
                          classes.candidate,
                        status === CANDIDATE_STATUS.INACTIVE &&
                          classes.inactive,
                      )}
                    >
                      {status}
                    </div>
                    <div className={classes.id}>Candidate: {id}</div>
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
    </div>
  );
};
