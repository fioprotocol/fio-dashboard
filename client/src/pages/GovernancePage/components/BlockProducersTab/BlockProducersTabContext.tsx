import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { showGenericErrorModal } from '../../../../redux/modal/actions';

import { getNextGovernanceDate } from '../../../../util/general';
import { useIsMetaMaskUser } from '../../../../hooks/user';
import { useMakeActionOnPathChange } from '../../../../hooks/general';

import { ROUTES } from '../../../../constants/routes';

import { BlockProducersItemProps } from '../../../../types/governance';

type Props = {
  listOfBlockProducers: BlockProducersItemProps[];
  resetSelectedBlockProducers: () => void;
};

type UseContextProps = {
  disabledCastBPVote: boolean;
  isMetaMaskUser: boolean;
  nextDate: string;
  handleCastVote: () => void;
};

export const useContext = (props: Props): UseContextProps => {
  const { listOfBlockProducers, resetSelectedBlockProducers } = props;

  const isMetaMaskUser = useIsMetaMaskUser();

  const nextDate = getNextGovernanceDate();

  useMakeActionOnPathChange({
    action: resetSelectedBlockProducers,
    route: ROUTES.GOVERNANCE_CAST_BLOCK_PRODUCER_VOTE,
  });

  const dispatch = useDispatch();
  const history = useHistory();

  const handleCastVote = useCallback(() => {
    if (listOfBlockProducers.every(({ checked }) => !checked)) {
      return dispatch(
        showGenericErrorModal(
          'You have made no selection. Please make them and try again.',
          'Nothing Selected',
        ),
      );
    } else {
      history.push(ROUTES.GOVERNANCE_CAST_BLOCK_PRODUCER_VOTE);
    }
  }, [dispatch, history, listOfBlockProducers]);

  return {
    disabledCastBPVote: listOfBlockProducers.every(({ checked }) => !checked),
    isMetaMaskUser,
    nextDate,
    handleCastVote,
  };
};
