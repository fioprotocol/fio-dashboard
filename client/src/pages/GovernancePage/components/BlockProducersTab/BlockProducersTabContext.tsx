import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { BlockProducersItemProps } from '../../../../types/governance';
import { getNextGovernanceDate } from '../../../../util/general';
import { showGenericErrorModal } from '../../../../redux/modal/actions';
import { ROUTES } from '../../../../constants/routes';

type Props = {
  listOfBlockProducers: BlockProducersItemProps[];
};

type UseContextProps = {
  disabledCastBPVote: boolean;
  nextDate: string;
  handleCastVote: () => void;
};

export const useContext = (props: Props): UseContextProps => {
  const { listOfBlockProducers } = props;

  const nextDate = getNextGovernanceDate();

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
    nextDate,
    handleCastVote,
  };
};
