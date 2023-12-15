import { useCallback, useState } from 'react';

import { MetamaskSnapProps } from '../utils/MetamaskSnapContext';

type UseContextProps = {
  onActionChange: (value: string) => void;
  onConnectClick: () => void;
  onSignTxn: () => void;
};

export const useContext = (
  metamaskSnapContext: MetamaskSnapProps,
): UseContextProps => {
  const { handleConnectClick } = metamaskSnapContext;
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const onActionChange = useCallback((value: string) => {
    setActiveAction(value);
  }, []);

  const onConnectClick = useCallback(() => {
    handleConnectClick();
  }, [handleConnectClick]);

  const onSignTxn = useCallback(() => {
    console.log('Active action', activeAction);
  }, [activeAction]);

  return { onActionChange, onConnectClick, onSignTxn };
};
