import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MetamaskSnap } from '../../../../services/MetamaskSnap';
import apis from '../../../../api';
import { signNonce } from '../../../../util/snap';
import { alternateLogin } from '../../../../redux/profile/actions';
import { WALLET_TYPES } from '../../../../constants/wallets';

type UseContextProps = {
  isModalOpen: boolean;
  connectMetamask: () => void;
  onDetailsClick: () => void;
  onModalClose: () => void;
};

export const useContext = (): UseContextProps => {
  const { derivationIndex, publicKey, handleConnectClick } = MetamaskSnap();

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
    } else {
      onDetailsClick();
    }
  }, [handleConnectClick, onDetailsClick]);

  const metamaskLogin = useCallback(async () => {
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
  }, [derivationIndex, dispatch, publicKey]);

  useEffect(() => {
    if (publicKey) {
      metamaskLogin();
    }
  }, [metamaskLogin, publicKey]);

  return {
    isModalOpen,
    connectMetamask,
    onDetailsClick,
    onModalClose,
  };
};
