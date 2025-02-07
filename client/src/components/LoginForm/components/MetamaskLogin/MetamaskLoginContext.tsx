import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { MetamaskSnap } from '../../../../services/MetamaskSnap';
import apis from '../../../../api';
import { signNonce } from '../../../../util/snap';
import { alternateLogin } from '../../../../redux/profile/actions';

import { WALLET_TYPES } from '../../../../constants/wallets';
import { log } from '../../../../util/general';
import { isMetaMask } from '../../../../util/ethereum';
import useEffectOnce from '../../../../hooks/general';

import { isAuthenticated } from '../../../../redux/profile/selectors';
import { refProfileCode } from '../../../../redux/refProfile/selectors';

const DEFAULT_METAMASK_ERROR =
  'Sign in with MetaMask has failed. Please try again.';

type UseContextProps = {
  alternativeLoginError: string | null;
  isDescriptionModalOpen: boolean;
  isLoginModalOpen: boolean;
  isMobileDeviceWithMetamask: boolean;
  connectMetamask: () => void;
  onDetailsClick: () => void;
  onDescriptionModalClose: () => void;
  onLoginModalClose: () => void;
};

type Props = {
  setAlternativeLoginErrorToParentsComponent?: (error: string | null) => void;
} | null;

export const useContext = (props?: Props): UseContextProps => {
  const { setAlternativeLoginErrorToParentsComponent } = props || {};

  const {
    derivationIndex,
    publicKey,
    snapError,
    handleConnectClick,
    resetSnap,
  } = MetamaskSnap();

  const [isDescriptionModalOpen, toggleIsDescriptionModalOpen] = useState<
    boolean
  >(false);
  const [isLoginModalOpen, toggleIsLoginModalOpen] = useState<boolean>(false);
  const [alternativeLoginError, setAlternativeLoginError] = useState<
    string | null
  >(null);

  const referrerCode = useSelector(refProfileCode);
  const isAuth = useSelector(isAuthenticated);

  const dispatch = useDispatch();

  const onDescriptionModalOpen = useCallback(() => {
    toggleIsDescriptionModalOpen(true);
  }, []);

  const onDescriptionModalClose = useCallback(() => {
    toggleIsDescriptionModalOpen(false);
  }, []);

  const onDetailsClick = useCallback(() => {
    onDescriptionModalOpen();
  }, [onDescriptionModalOpen]);

  const onLoginModalOpen = useCallback(() => {
    toggleIsLoginModalOpen(true);
  }, []);

  const onLoginModalClose = useCallback(() => {
    toggleIsLoginModalOpen(false);
  }, []);

  const connectMetamask = useCallback(() => {
    if (isMetaMask()) {
      onLoginModalOpen();
      handleConnectClick();
      setAlternativeLoginError(null);
    } else {
      onDetailsClick();
    }
  }, [handleConnectClick, onDetailsClick, onLoginModalOpen]);

  const metamaskLogin = useCallback(async () => {
    try {
      const { nonce } = await apis.auth.generateNonce();
      const signature = await signNonce({ nonce, derivationIndex });

      dispatch(
        alternateLogin({
          derivationIndex,
          from: WALLET_TYPES.METAMASK,
          nonce,
          publicKey,
          signature,
          referrerCode,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      );
    } catch (error) {
      log.error('Metamask Login error', error);
      setAlternativeLoginError(DEFAULT_METAMASK_ERROR);
    }
  }, [derivationIndex, dispatch, publicKey, referrerCode]);

  useEffect(() => {
    if (publicKey && !alternativeLoginError && !isAuth) {
      metamaskLogin();
    }
  }, [metamaskLogin, publicKey, alternativeLoginError, isAuth]);

  useEffect(() => {
    if (alternativeLoginError) {
      onLoginModalClose();
    }
  }, [alternativeLoginError, onLoginModalClose]);

  useEffect(() => {
    if (snapError) {
      setAlternativeLoginError(DEFAULT_METAMASK_ERROR);
    }
  }, [snapError]);

  useEffectOnce(() => {
    resetSnap();
    setAlternativeLoginError(null);
  }, []);

  useEffect(() => {
    setAlternativeLoginErrorToParentsComponent &&
      setAlternativeLoginErrorToParentsComponent(alternativeLoginError);
  }, [alternativeLoginError, setAlternativeLoginErrorToParentsComponent]);

  return {
    alternativeLoginError,
    isDescriptionModalOpen,
    isLoginModalOpen,
    isMobileDeviceWithMetamask: isMobile && isMetaMask(),
    connectMetamask,
    onDetailsClick,
    onDescriptionModalClose,
    onLoginModalClose,
  };
};
