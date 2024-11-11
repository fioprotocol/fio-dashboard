import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { showGenericErrorModal } from '../../../../redux/modal/actions';

import { user as userSelector } from '../../../../redux/profile/selectors';

import { getNextGovernanceDate } from '../../../../util/general';

import { ROUTES } from '../../../../constants/routes';
import { USER_PROFILE_TYPE } from '../../../../constants/profile';

import { BlockProducersItemProps } from '../../../../types/governance';

type Props = {
  listOfBlockProducers: BlockProducersItemProps[];
};

type UseContextProps = {
  disabledCastBPVote: boolean;
  isMetaMaskUser: boolean;
  nextDate: string;
  handleCastVote: () => void;
};

export const useContext = (props: Props): UseContextProps => {
  const { listOfBlockProducers } = props;

  const user = useSelector(userSelector);

  const isMetaMaskUser =
    window.ethereum?.isMetaMask &&
    user?.userProfileType === USER_PROFILE_TYPE.ALTERNATIVE;

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
    isMetaMaskUser,
    nextDate,
    handleCastVote,
  };
};
