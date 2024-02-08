import { useCallback, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useContext as useContextMetamaskLogin } from '../../components/LoginForm/components/MetamaskLogin/MetamaskLoginContext';

import { alternativeLoginError as alternativeLoginErrorSelector } from '../../redux/profile/selectors';
import { setRedirectPath } from '../../redux/navigation/actions';

import { ROUTES } from '../../constants/routes';

type Props = {
  alternativeLoginError: string;
  isLoginModalOpen: boolean;
  noMetamaskExtention: boolean;
  handleConnectClick: () => void;
  onLoginModalClose: () => void;
};

export const useContext = (): Props => {
  const {
    isLoginModalOpen,
    connectMetamask,
    onLoginModalClose,
  } = useContextMetamaskLogin();

  const [noMetamaskExtention, toggleNoMetamaskExtention] = useState<boolean>(
    false,
  );

  const alternativeLoginError = useSelector(alternativeLoginErrorSelector);

  const dispatch = useDispatch();

  const handleConnectClick = useCallback(() => {
    if (window.ethereum?.isMetaMask) {
      connectMetamask();
      dispatch(setRedirectPath({ pathname: ROUTES.HOME }));
    } else {
      toggleNoMetamaskExtention(true);
    }
  }, [connectMetamask, dispatch]);

  return {
    alternativeLoginError,
    isLoginModalOpen,
    noMetamaskExtention,
    handleConnectClick,
    onLoginModalClose,
  };
};
