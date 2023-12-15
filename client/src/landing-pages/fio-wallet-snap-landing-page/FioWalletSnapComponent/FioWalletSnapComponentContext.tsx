import { useCallback, useState } from 'react';

import { MetamaskSnapProps } from '../utils/MetamaskSnapContext';
import { log } from '../../../util/general';
import { ACTIONS } from '../../../constants/fio';

type UseContextProps = {
  activeAction: string;
  executedTxn: any;
  executedTxnError: Error | null;
  executedTxnLoading: boolean;
  fioActionFormParams: any;
  onActionChange: (value: string) => void;
  onConnectClick: () => void;
  onExecuteTxn: () => void;
  onSignTxn: () => void;
  onSubmitActionForm: (values: any) => void;
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
  const [fioActionFormParams, setFioActionFormParams] = useState<any | null>(
    null,
  );

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
    const params: {
      apiUrl: string;
      contract?: string;
      action?: string;
      data?: any;
    } = {
      apiUrl: 'https://fiotestnet.blockpane.com',
    };
    if (activeAction === ACTIONS.addPublicAddress) {
      params.action = 'addaddress';
      params.contract = 'fio.address';
      params.data = {
        fio_address: fioActionFormParams.fioHandle,
        public_addresses: [
          {
            chain_code: fioActionFormParams.chainCode,
            token_code: fioActionFormParams.tokenCode,
            public_address: fioActionFormParams.publicAddress,
          },
        ],
        max_fee: 600000000,
        tpid: process.env.REACT_APP_DEFAULT_TPID,
      };
    }

    signSnapTxn(params);
  }, [
    activeAction,
    fioActionFormParams?.chainCode,
    fioActionFormParams?.fioHandle,
    fioActionFormParams?.publicAddress,
    fioActionFormParams?.tokenCode,
    signSnapTxn,
  ]);

  const onSubmitActionForm = useCallback((values: any) => {
    setFioActionFormParams(values);
  }, []);

  return {
    activeAction,
    executedTxn,
    executedTxnError,
    executedTxnLoading,
    fioActionFormParams,
    onActionChange,
    onConnectClick,
    onExecuteTxn,
    onSignTxn,
    onSubmitActionForm,
  };
};
