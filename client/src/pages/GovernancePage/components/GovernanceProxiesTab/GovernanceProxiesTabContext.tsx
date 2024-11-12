import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { showGenericErrorModal } from '../../../../redux/modal/actions';

import { ROUTES } from '../../../../constants/routes';

import { DetailedProxy } from '../../../../types';

type Props = {
  listOfProxies: DetailedProxy[];
};

type UseContextProps = {
  handleProxyVote: () => void;
};

export const useContext = (props: Props): UseContextProps => {
  const { listOfProxies } = props;

  const dispatch = useDispatch();
  const history = useHistory();

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
