import { useCallback, useState } from 'react';

import { MetamaskSnapProps } from '../utils/MetamaskSnapContext';
import { log } from '../../../util/general';

type UseContextProps = {
  executedTxn: any;
  executedTxnError: Error | null;
  executedTxnLoading: boolean;
  onActionChange: (value: string) => void;
  onConnectClick: () => void;
  onExecuteTxn: () => void;
  onSignTxn: () => void;
};

export const useContext = (
  metamaskSnapContext: MetamaskSnapProps,
): UseContextProps => {
  const { signedTxn, handleConnectClick, signSnapTxn } = metamaskSnapContext;

  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [executedTxn, setExecutedTxn] = useState<any | null>(null);
  const [executedTxnLoading, toggleExecutedTxnLoading] = useState<boolean>(
    false,
  );
  const [executedTxnError, setExecutedTxnError] = useState<Error | null>(null);

  const onActionChange = useCallback((value: string) => {
    setActiveAction(value);
  }, []);

  const onConnectClick = useCallback(() => {
    handleConnectClick();
  }, [handleConnectClick]);

  const executeFioAction = useCallback(async () => {
    try {
      setExecutedTxnError(null);
      toggleExecutedTxnLoading(true);

      const pushResult = await fetch(
        'https://fiotestnet.blockpane.com/v1/chain/push_transaction',
        {
          body: JSON.stringify(signedTxn),
          method: 'POST',
        },
      );

      const jsonResult = await pushResult.json();
      setExecutedTxn(jsonResult);
    } catch (error) {
      log.error(error);
      setExecutedTxnError(error);
    } finally {
      toggleExecutedTxnLoading(false);
    }
  }, [signedTxn]);

  const onExecuteTxn = useCallback(() => {
    executeFioAction();
  }, [executeFioAction]);

  const onSignTxn = useCallback(() => {
    signSnapTxn();
  }, [signSnapTxn]);

  console.log('activeAction', activeAction);

  return {
    executedTxn,
    executedTxnError,
    executedTxnLoading,
    onActionChange,
    onConnectClick,
    onExecuteTxn,
    onSignTxn,
  };
};
