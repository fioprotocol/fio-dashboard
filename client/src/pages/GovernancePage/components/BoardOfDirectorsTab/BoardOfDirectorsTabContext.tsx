import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getNextGovernanceDate } from '../../../../util/general';
import { overviewWalletHasLowBalanceAndHasProxy } from '../../../../util/governance';

import { showGenericErrorModal } from '../../../../redux/modal/actions';
import { ROUTES } from '../../../../constants/routes';
import {
  fioAddresses,
  loading as fioHandlesLoadingSelector,
} from '../../../../redux/fio/selectors';

import { useMakeActionOnPathChange } from '../../../../hooks/general';

import { CandidateProps, OverviewWallet } from '../../../../types/governance';

type Props = {
  listOfCandidates: CandidateProps[];
  overviewWallets: OverviewWallet[];
  overviewWalletsLoading: boolean;
  resetSelectedCandidates: () => void;
};

type UseContextProps = {
  activeCandidate: CandidateProps;
  disabledCastBoardVote: boolean;
  hasLowBalance: boolean;
  hasProxy: boolean;
  nextDate: string;
  showCandidateDetailsModal: boolean;
  showNoAssociatedFioHandlesWarning: boolean;
  onCloseModal: () => void;
  handleCandidateDetailsModalOpen: (candidate: CandidateProps) => void;
  handleCastVote: () => void;
};

export const useContext = (props: Props): UseContextProps => {
  const {
    listOfCandidates,
    overviewWallets,
    overviewWalletsLoading,
    resetSelectedCandidates,
  } = props;

  const fioHandles = useSelector(fioAddresses);
  const fioHandlesLoading = useSelector(fioHandlesLoadingSelector);

  const [showCandidateDetailsModal, toggleShowCandidateDetailsModal] = useState<
    boolean
  >(false);
  const [activeCandidate, setActiveCandidate] = useState<CandidateProps | null>(
    null,
  );

  const dispatch = useDispatch();
  const history = useHistory();

  const nextDate = getNextGovernanceDate();

  const { hasLowBalance, hasProxy } =
    !overviewWalletsLoading &&
    overviewWalletHasLowBalanceAndHasProxy(overviewWallets);

  useMakeActionOnPathChange({
    action: resetSelectedCandidates,
    route: ROUTES.GOVERNANCE_CAST_BOARD_VOTE,
  });

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

  return {
    activeCandidate,
    disabledCastBoardVote:
      (!fioHandlesLoading && !fioHandles.length) || hasLowBalance || hasProxy,
    hasLowBalance,
    hasProxy,
    nextDate,
    showCandidateDetailsModal,
    showNoAssociatedFioHandlesWarning: !fioHandlesLoading && !fioHandles.length,
    onCloseModal,
    handleCandidateDetailsModalOpen,
    handleCastVote,
  };
};
