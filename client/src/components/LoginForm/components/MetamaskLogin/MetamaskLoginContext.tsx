import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { MetamaskSnap } from '../../../../services/MetamaskSnap';
import apis from '../../../../api';
import { signNonce } from '../../../../util/snap';
import { alternateLogin } from '../../../../redux/profile/actions';
import { WALLET_TYPES } from '../../../../constants/wallets';

type UseContextProps = {
  connectMetamask: () => void;
};

export const useContext = (): UseContextProps => {
  const { derivationIndex, publicKey, handleConnectClick } = MetamaskSnap();

  const dispatch = useDispatch();

  const connectMetamask = useCallback(() => {
    handleConnectClick();
  }, [handleConnectClick]);

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
    connectMetamask,
  };
};
