import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { showGenericErrorModal } from '../../../../redux/modal/actions';

import { useIsMetaMaskUser } from '../../../../hooks/user';
import { useMakeActionOnPathChange } from '../../../../hooks/general';
import { overviewWalletHasLowBalanceAndHasProxy } from '../../../../util/governance';

import { ROUTES } from '../../../../constants/routes';

import {
  BlockProducersItemProps,
  OverviewWallet,
} from '../../../../types/governance';

type Props = {
  listOfBlockProducers: BlockProducersItemProps[];
  overviewWallets: OverviewWallet[];
  overviewWalletsLoading: boolean;
  resetSelectedBlockProducers: () => void;
};

type UseContextProps = {
  disabledCastBPVote: boolean;
  isMetaMaskUser: boolean;
  hasLowBalance: boolean;
  handleCastVote: () => void;
};

export const useContext = (props: Props): UseContextProps => {
  const {
    listOfBlockProducers,
    overviewWallets,
    overviewWalletsLoading,
    resetSelectedBlockProducers,
  } = props;

  const isMetaMaskUser = useIsMetaMaskUser();

  useMakeActionOnPathChange({
    action: resetSelectedBlockProducers,
    route: ROUTES.GOVERNANCE_CAST_BLOCK_PRODUCER_VOTE,
  });

  const dispatch = useDispatch();
  const history = useHistory();

  const { hasLowBalance } =
    !overviewWalletsLoading &&
    overviewWalletHasLowBalanceAndHasProxy(overviewWallets);

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
    disabledCastBPVote:
      listOfBlockProducers.every(({ checked }) => !checked) ||
      hasLowBalance ||
      isMetaMaskUser,
    hasLowBalance,
    isMetaMaskUser,
    handleCastVote,
  };
};
