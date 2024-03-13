import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { MetamaskSnap } from '../../../../services/MetamaskSnap';
import apis from '../../../../api';
import { signNonce } from '../../../../util/snap';
import {
  alternateLogin,
  resetAlternativeLoginError,
  setAlternativeLoginError,
} from '../../../../redux/profile/actions';

import { alternativeLoginError as alternativeLoginErrorSelector } from '../../../../redux/profile/selectors';

import { WALLET_TYPES } from '../../../../constants/wallets';
import { log } from '../../../../util/general';

const DEFAULT_METAMASK_ERROR =
  'Sign in with MetaMask has failed. Please try again.';

type UseContextProps = {
  isDescriptionModalOpen: boolean;
  isLoginModalOpen: boolean;
  isMobileDeviceWithMetamask: boolean;
  connectMetamask: () => void;
  onDetailsClick: () => void;
  onDescriptionModalClose: () => void;
  onLoginModalClose: () => void;
};

export const useContext = (): UseContextProps => {
  const {
    derivationIndex,
    publicKey,
    snapError,
    handleConnectClick,
  } = MetamaskSnap();
  const alternativeLoginError = useSelector(alternativeLoginErrorSelector);

  const [isDescriptionModalOpen, toggleIsDescriptionModalOpen] = useState<
    boolean
  >(false);
  const [isLoginModalOpen, toggleIsLoginModalOpen] = useState<boolean>(false);

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
    if (window.ethereum.isMetaMask) {
      onLoginModalOpen();
      handleConnectClick();
      dispatch(resetAlternativeLoginError());
    } else {
      onDetailsClick();
    }
  }, [dispatch, handleConnectClick, onDetailsClick, onLoginModalOpen]);

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
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      );
    } catch (error) {
      log.error('Metamask Login error', error);
      dispatch(setAlternativeLoginError(DEFAULT_METAMASK_ERROR));
    }
  }, [derivationIndex, dispatch, publicKey]);

  useEffect(() => {
    if (publicKey && !alternativeLoginError) {
      metamaskLogin();
    }
  }, [metamaskLogin, publicKey, alternativeLoginError]);

  useEffect(() => {
    if (alternativeLoginError) {
      onLoginModalClose();
    }
  }, [alternativeLoginError, onLoginModalClose]);

  useEffect(() => {
    if (snapError) {
      dispatch(setAlternativeLoginError(DEFAULT_METAMASK_ERROR));
    }
  }, [dispatch, snapError]);

  return {
    isDescriptionModalOpen,
    isLoginModalOpen,
    isMobileDeviceWithMetamask: isMobile && window.ethereum?.isMetaMask,
    connectMetamask,
    onDetailsClick,
    onDescriptionModalClose,
    onLoginModalClose,
  };
};
