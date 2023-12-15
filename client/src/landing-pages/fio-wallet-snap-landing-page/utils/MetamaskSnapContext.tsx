import { useCallback, useEffect, useState } from 'react';

import { connectSnap, getPublicKey, getSnap } from './snap';
import { log } from '../../../util/general';

export type MetamaskSnapProps = {
  publicKey: string | null;
  snapError: Error;
  snapLoading: boolean;
  state: any;
  handleConnectClick: () => void;
};

export const MetamaskSnapContext = (): MetamaskSnapProps => {
  const [state, setState] = useState<any | null>(null);
  const [snapError, setSnapError] = useState<Error | null>(null);
  const [snapLoading, toggleSnapLoading] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnectClick = useCallback(async () => {
    try {
      toggleSnapLoading(true);
      setSnapError(null);
      await connectSnap();
      const installedSnap = await getSnap();

      setState(installedSnap);
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    if (state?.enabled) {
      getPublicKeyFromSnap();
    }
  }, [getPublicKeyFromSnap, state?.enabled]);

  return {
    publicKey,
    snapLoading,
    snapError,
    state,
    handleConnectClick,
  };
};
