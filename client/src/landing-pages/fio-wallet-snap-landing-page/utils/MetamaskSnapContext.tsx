import { useCallback, useEffect, useState } from 'react';

import { connectSnap, getPublicKey, getSnap, signTxn } from './snap';
import { log } from '../../../util/general';

export type MetamaskSnapProps = {
  publicKey: string | null;
  signedTxn: any | null;
  signedTxnError: Error;
  signedTxnLoading: boolean;
  snapError: Error;
  snapLoading: boolean;
  state: any;
  clearSignTx: () => void;
  handleConnectClick: () => void;
  signSnapTxn: (params: any) => void;
};

export const MetamaskSnapContext = (): MetamaskSnapProps => {
  const [state, setState] = useState<any | null>(null);
  const [snapError, setSnapError] = useState<Error | null>(null);
  const [snapLoading, toggleSnapLoading] = useState<boolean>(false);
  const [signedTxnLoading, toggleSignedTxnLoading] = useState<boolean>(false);
  const [signedTxn, setSignedTxn] = useState<any | null>(null);
  const [signedTxnError, setSignedTxnError] = useState<Error | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const clearSignTx = useCallback(() => {
    setSignedTxn(null);
    setSignedTxnError(null);
  }, []);

  const handleConnectClick = useCallback(async () => {
    try {
      toggleSnapLoading(true);
      setSnapError(null);

      await connectSnap();

      const installedSnap = await getSnap();

      setState(installedSnap);
    } catch (error) {
      log.error(error);
      setSnapError(error);
    } finally {
      toggleSnapLoading(false);
    }
  }, []);

  const getPublicKeyFromSnap = useCallback(async () => {
    try {
      const publicKey = await getPublicKey();

      setPublicKey(publicKey);
    } catch (error) {
      log.error(error);
    }
  }, []);

  const signSnapTxn = useCallback(async (params: any) => {
    try {
      setSignedTxnError(null);
      toggleSignedTxnLoading(true);

      const signedTxn = await signTxn(params);

      setSignedTxn(signedTxn);
    } catch (error) {
      log.error(error);
      setSignedTxnError(error);
    } finally {
      toggleSignedTxnLoading(false);
    }
  }, []);

  useEffect(() => {
    if (state?.enabled) {
      getPublicKeyFromSnap();
    }
  }, [getPublicKeyFromSnap, state?.enabled]);

  return {
    publicKey,
    signedTxn,
    signedTxnError,
    signedTxnLoading,
    snapLoading,
    snapError,
    state,
    clearSignTx,
    handleConnectClick,
    signSnapTxn,
  };
};
