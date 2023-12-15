import { useCallback, useState } from 'react';

type UseContextProps = {
  onActionChange: (value: string) => void;
  onConnectClick: () => void;
  onSignTxn: () => void;
};

export const useContext = (): UseContextProps => {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const onActionChange = useCallback((value: string) => {
    setActiveAction(value);
  }, []);

  const onConnectClick = useCallback(() => {
    console.log('Connect');
  }, []);

  const onSignTxn = useCallback(() => {
    console.log('Active action', activeAction);
  }, [activeAction]);

  return { onActionChange, onConnectClick, onSignTxn };
};
