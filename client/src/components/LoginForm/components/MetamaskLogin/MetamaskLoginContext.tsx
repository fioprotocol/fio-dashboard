import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
  isModalOpen: boolean;
  connectMetamask: () => void;
  onDetailsClick: () => void;
  onModalClose: () => void;
};

export const useContext = (): UseContextProps => {
  const {
    derivationIndex,
    publicKey,
    snapError,
    handleConnectClick,
  } = MetamaskSnap();
  const alternativeLoginError = useSelector(alternativeLoginErrorSelector);

  const [isModalOpen, toggleIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  const onModalOpen = useCallback(() => {
    toggleIsModalOpen(true);
  }, []);

  const onModalClose = useCallback(() => {
    toggleIsModalOpen(false);
  }, []);

  const onDetailsClick = useCallback(() => {
    onModalOpen();
  }, [onModalOpen]);

  const connectMetamask = useCallback(() => {
    if (window.ethereum) {
      handleConnectClick();
      dispatch(resetAlternativeLoginError());
    } else {
      onDetailsClick();
    }
  }, [dispatch, handleConnectClick, onDetailsClick]);

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
    if (snapError) {
      dispatch(setAlternativeLoginError(DEFAULT_METAMASK_ERROR));
    }
  }, [dispatch, snapError]);

  return {
    isModalOpen,
    connectMetamask,
    onDetailsClick,
    onModalClose,
  };
};
