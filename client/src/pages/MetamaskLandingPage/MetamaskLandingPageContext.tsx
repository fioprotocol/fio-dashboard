import { useCallback, useState } from 'react';

import { useDispatch } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { useContext as useContextMetamaskLogin } from '../../components/LoginForm/components/MetamaskLogin/MetamaskLoginContext';

import { setRedirectPath } from '../../redux/navigation/actions';

import { ROUTES } from '../../constants/routes';

type Props = {
  alternativeLoginError: string;
  isLoginModalOpen: boolean;
  isMobileDeviceWithMetamask: boolean;
  noMetamaskExtention: boolean;
  handleConnectClick: () => void;
  onLoginModalClose: () => void;
};

export const useContext = (): Props => {
  const {
    alternativeLoginError,
    isLoginModalOpen,
    connectMetamask,
    onLoginModalClose,
  } = useContextMetamaskLogin();

  const [noMetamaskExtention, toggleNoMetamaskExtention] = useState<boolean>(
    false,
  );

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
    isMobileDeviceWithMetamask: isMobile && window.ethereum?.isMetaMask,
    noMetamaskExtention,
    handleConnectClick,
    onLoginModalClose,
  };
};
