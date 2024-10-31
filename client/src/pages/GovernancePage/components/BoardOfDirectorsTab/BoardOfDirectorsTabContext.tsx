import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getNextGovernanceDate } from '../../../../util/general';

import { showGenericErrorModal } from '../../../../redux/modal/actions';
import { ROUTES } from '../../../../constants/routes';
import {
  fioAddresses,
  loading as fioHandlesLoadingSelector,
} from '../../../../redux/fio/selectors';
import { useGetCandidates } from '../../../../hooks/governance';

import { CandidateProps } from '../../../../types/governance';

type UseContextProps = {
  activeCandidate: CandidateProps;
  disabledCastBoardVote: boolean;
  listOfCandidates: Array<CandidateProps>;
  loading: boolean;
  nextDate: string;
  showCandidateDetailsModal: boolean;
  onCheckBoxChange: (id: string) => void;
  onCloseModal: () => void;
  handleCandidateDetailsModalOpen: (candidate: CandidateProps) => void;
  handleCastVote: () => void;
};

export const useContext = (): UseContextProps => {
  const fioHandles = useSelector(fioAddresses);
  const fioHandlesLoading = useSelector(fioHandlesLoadingSelector);

  const [listOfCandidates, setListOfCandidates] = useState<
    Array<CandidateProps>
  >([]);
  const [showCandidateDetailsModal, toggleShowCandidateDetailsModal] = useState<
    boolean
  >(false);
  const [activeCandidate, setActiveCandidate] = useState<CandidateProps | null>(
    null,
  );
  const { loading, candidatesList } = useGetCandidates();

  const dispatch = useDispatch();
  const history = useHistory();

  const nextDate = getNextGovernanceDate();

  const onCheckBoxChange = useCallback((id: string) => {
    setListOfCandidates(prevCandidates =>
      prevCandidates.map(candidate =>
        candidate.id === id
          ? { ...candidate, checked: !candidate.checked }
          : candidate,
      ),
    );
  }, []);

  const handleCandidateDetailsModalOpen = useCallback(
    (candidate: CandidateProps) => {
      setActiveCandidate(candidate);
      toggleShowCandidateDetailsModal(true);
    },
    [setActiveCandidate],
  );

  const onCloseModal = useCallback(() => {
    toggleShowCandidateDetailsModal(false);
    setActiveCandidate(null);
  }, []);

  const handleCastVote = useCallback(() => {
    if (listOfCandidates.every(candidate => !candidate.checked)) {
      return dispatch(
        showGenericErrorModal(
          'You have made no selection. Please make them and try again.',
          'Nothing Selected',
        ),
      );
    } else {
      history.push(ROUTES.GOVERNANCE_CAST_BOARD_VOTE);
    }
  }, [dispatch, history, listOfCandidates]);

  useEffect(() => {
    if (candidatesList?.length) {
      setListOfCandidates(
        candidatesList.map(candidateItem => ({
          ...candidateItem,
          checked: false,
        })),
      );
    }
  }, [candidatesList]);

  return {
    activeCandidate,
    disabledCastBoardVote: !fioHandlesLoading && !fioHandles.length,
    listOfCandidates,
    loading,
    nextDate,
    showCandidateDetailsModal,
    onCheckBoxChange,
    onCloseModal,
    handleCandidateDetailsModalOpen,
    handleCastVote,
  };
};
