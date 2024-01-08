import { useCallback, useEffect, useState } from 'react';
import { Ecc } from '@fioprotocol/fiojs';

import { connectSnap, getPublicKey, getSnap, signTxn, signNonce } from './snap';
import { log } from '../../../util/general';
import { defaultSnapOrigin } from '../constants';

export type MetamaskSnapProps = {
  isSignatureVerified: boolean | null;
  publicKey: string | null;
  signedTxn: any | null;
  signedTxnError: Error;
  signedTxnLoading: boolean;
  snapError: Error;
  snapLoading: boolean;
  state: any;
  signature: string;
  signatureError: Error | null;
  signatureLoading: boolean;
  clearSignTx: () => void;
  clearSignNonceResults: () => void;
  handleConnectClick: () => void;
  signSnapTxn: (params: any) => void;
  signNonceSnap: (params: { nonce: string }) => void;
};

export const MetamaskSnapContext = (): MetamaskSnapProps => {
  const [state, setState] = useState<any | null>(null);
  const [snapError, setSnapError] = useState<Error | null>(null);
  const [snapLoading, toggleSnapLoading] = useState<boolean>(false);
  const [signedTxnLoading, toggleSignedTxnLoading] = useState<boolean>(false);
  const [signedTxn, setSignedTxn] = useState<any | null>(null);
  const [signedTxnError, setSignedTxnError] = useState<Error | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSignatureVerified, setIsSignatureVerified] = useState<
    boolean | null
  >(null);
  const [signatureError, setSignatureError] = useState<Error | null>(null);
  const [signatureLoading, toggleSignatureLoading] = useState<boolean>(false);

  const clearSignTx = useCallback(() => {
    setSignedTxn(null);
    setSignedTxnError(null);
  }, []);

  const handleConnectClick = useCallback(async () => {
    try {
      toggleSnapLoading(true);
      setSnapError(null);

      await connectSnap(defaultSnapOrigin, {
        version: process.env.REACT_APP_SNAP_VERSION,
      });

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

  const verifySignature = useCallback(
    async ({ signature, nonce }: { signature: string; nonce: string }) => {
      const isVerified = await Ecc.verify(signature, nonce, publicKey);
      setIsSignatureVerified(isVerified);
    },
    [publicKey],
  );

  const clearSignNonceResults = useCallback(() => {
    setSignature(null);
    setSignatureError(null);
  }, []);

  const signNonceSnap = useCallback(
    async (params: { nonce: string }) => {
      try {
        clearSignNonceResults();
        toggleSignatureLoading(true);
        const signature = await signNonce(params);
        setSignature(signature);
        verifySignature({ signature, nonce: params.nonce });
      } catch (error) {
        log.error(error);
        setSignatureError(error);
      } finally {
        toggleSignatureLoading(false);
      }
    },
    [clearSignNonceResults, verifySignature],
  );

  useEffect(() => {
    if (state?.enabled) {
      getPublicKeyFromSnap();
    }
  }, [getPublicKeyFromSnap, state?.enabled]);

  return {
    isSignatureVerified,
    publicKey,
    signedTxn,
    signedTxnError,
    signedTxnLoading,
    snapLoading,
    snapError,
    state,
    signature,
    signatureError,
    signatureLoading,
    clearSignTx,
    clearSignNonceResults,
    handleConnectClick,
    signSnapTxn,
    signNonceSnap,
  };
};
