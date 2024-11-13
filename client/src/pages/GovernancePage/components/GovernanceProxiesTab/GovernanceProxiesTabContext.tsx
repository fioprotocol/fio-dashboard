import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { showGenericErrorModal } from '../../../../redux/modal/actions';

import { useMakeActionOnPathChange } from '../../../../hooks/general';

import { ROUTES } from '../../../../constants/routes';

import { DetailedProxy } from '../../../../types';

type Props = {
  listOfProxies: DetailedProxy[];
  resetSelectedProxies: () => void;
};

type UseContextProps = {
  handleProxyVote: () => void;
};

export const useContext = (props: Props): UseContextProps => {
  const { listOfProxies, resetSelectedProxies } = props;

  const dispatch = useDispatch();
  const history = useHistory();

  useMakeActionOnPathChange({
    action: resetSelectedProxies,
    route: ROUTES.GOVERNANCE_PROXIES_VOTE,
  });

  const handleProxyVote = useCallback(() => {
    if (listOfProxies.every(({ checked }) => !checked)) {
      return dispatch(
        showGenericErrorModal(
          'You have made no selection. Please make them and try again.',
          'Nothing Selected',
        ),
      );
    } else {
      history.push(ROUTES.GOVERNANCE_PROXIES_VOTE);
    }
  }, [dispatch, history, listOfProxies]);

  return {
    handleProxyVote,
  };
};
