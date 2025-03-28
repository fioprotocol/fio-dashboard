import { useCallback, useEffect, useState } from 'react';
import { Ecc } from '@fioprotocol/fiojs';
import { MetaMaskInpageProvider } from '@metamask/providers';

import {
  connectSnap,
  getPublicKey,
  getSnap,
  signTxn,
  signNonce,
  decryptContent,
  Snap,
} from '../util/snap';
import { log } from '../util/general';
import { defaultSnapOrigin } from '../landing-pages/fio-wallet-snap-landing-page/constants';
import { useMetaMaskProvider } from '../hooks/useMetaMaskProvider';

export type MetamaskSnapProps = {
  derivationIndex: number;
  decryptedContent: any;
  decryptedError: Error | null;
  decryptLoading: boolean;
  isSignatureVerified: boolean | null;
  publicKey: string | null;
  signedTxn: any | null;
  signedTxnError: Error;
  signedTxnLoading: boolean;
  snapError: Error;
  snapLoading: boolean;
  state: Snap;
  signature: string;
  signatureError: Error | null;
  signatureLoading: boolean;
  metaMaskProvider: MetaMaskInpageProvider;
  clearDecryptResults: () => void;
  clearSignTx: () => void;
  clearSignNonceResults: () => void;
  decryptRequestContent: (params: {
    content: string;
    derivationIndex?: number;
    encryptionPublicKey: string;
    contentType: string;
  }) => void;
  handleConnectClick: (shouldConnectToStrictVersion?: boolean) => void;
  resetSnap: () => void;
  signSnapTxn: (params: any) => void;
  signNonceSnap: (params: { nonce: string; derivationIndex?: number }) => void;
  setDerivationIndex: (value: number) => void;
};

export const MetamaskSnap = (): MetamaskSnapProps => {
  const [state, setState] = useState<Snap | null>(null);
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
  const [decryptedContent, setDecryptedContent] = useState<any | null>(null);
  const [decryptedError, setDecryptedError] = useState<Error | null>(null);
  const [decryptLoading, toggleDecryptLoading] = useState<boolean>(false);
  const [derivationIndex, setDerivationIndex] = useState<number>(0);

  const metaMaskProvider = useMetaMaskProvider();

  const clearSignTx = useCallback(() => {
    setSignedTxn(null);
    setSignedTxnError(null);
  }, []);

  const handleConnectClick = useCallback(
    async (shouldConnectToStrictVersion?: boolean) => {
      try {
        toggleSnapLoading(true);
        setSnapError(null);
        let version = process.env.REACT_APP_SNAP_VERSION;

        if (shouldConnectToStrictVersion) {
          version = process.env.REACT_APP_SNAP_STRICT_VERSION;
        }

        await connectSnap(
          defaultSnapOrigin,
          {
            version,
          },
          metaMaskProvider as MetaMaskInpageProvider,
        );

        const installedSnap = await getSnap(
          metaMaskProvider as MetaMaskInpageProvider,
        );

        setState(installedSnap);
      } catch (error) {
        log.error('Metamask snap connection error', error);
        if (
          /One or more permissions are not allowed/.test(error?.message) &&
          !shouldConnectToStrictVersion
        ) {
          await handleConnectClick(true);
        } else {
          setSnapError(error);
        }
      } finally {
        toggleSnapLoading(false);
      }
    },
    [],
  );

  const getPublicKeyFromSnap = useCallback(
    async ({ derivationIndex }: { derivationIndex?: number }) => {
      try {
        const publicKey = await getPublicKey(
          metaMaskProvider as MetaMaskInpageProvider,
          { derivationIndex },
        );

        setPublicKey(publicKey);
      } catch (error) {
        log.error(error);
      }
    },
    [],
  );

  const signSnapTxn = useCallback(async (params: any) => {
    try {
      setSignedTxnError(null);
      toggleSignedTxnLoading(true);

      const signedTxn = await signTxn(
        metaMaskProvider as MetaMaskInpageProvider,
        params,
      );

      setSignedTxn(signedTxn);
    } catch (error) {
      log.error('Sign metamask transaction error:', error);
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
    async (params: { nonce: string; derviationIndex?: number }) => {
      try {
        clearSignNonceResults();
        toggleSignatureLoading(true);
        const signature = await signNonce(
          metaMaskProvider as MetaMaskInpageProvider,
          params,
        );
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

  const decryptRequestContent = useCallback(
    async (params: {
      content: string;
      derivationIndex?: number;
      encryptionPublicKey: string;
      contentType: string;
    }) => {
      try {
        toggleDecryptLoading(true);
        const decryptedContent = await decryptContent(
          metaMaskProvider as MetaMaskInpageProvider,
          params,
        );
        setDecryptedContent(decryptedContent);
      } catch (error) {
        log.error(error);
        setDecryptedError(error);
      } finally {
        toggleDecryptLoading(false);
      }
    },
    [],
  );

  const clearDecryptResults = useCallback(() => {
    setDecryptedError(null);
    setDecryptedContent(null);
  }, []);

  const resetSnap = useCallback(() => {
    setState(null);
    setPublicKey(null);
  }, []);

  useEffect(() => {
    if (state?.enabled) {
      getPublicKeyFromSnap({ derivationIndex });
    }
  }, [derivationIndex, getPublicKeyFromSnap, state?.enabled]);

  return {
    derivationIndex,
    decryptedContent,
    decryptedError,
    decryptLoading,
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
    clearDecryptResults,
    clearSignTx,
    clearSignNonceResults,
    decryptRequestContent,
    handleConnectClick,
    resetSnap,
    signSnapTxn,
    signNonceSnap,
    setDerivationIndex,
    metaMaskProvider: metaMaskProvider as MetaMaskInpageProvider,
  };
};
