import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateWalletsTxHistory } from '../../redux/fioWalletsData/actions';

import { fioWalletsTxHistory as fioWalletsTxHistorySelector } from '../../redux/fioWalletsData/selectors';
import { user as userSelector } from '../../redux/profile/selectors';

import useInterval from '../../util/hooks';
import { checkTransactions } from '../../util/transactions';
import useEffectOnce from '../../hooks/general';
import { log } from '../../util/general';

import { FioWalletTxHistory } from '../../types';

type Props = {
  walletPublicKey: string;
};

const TIMER_DELAY = 8000; // 8 sec

export const useWalletTxHistory = (props: Props): React.FC | null => {
  const { walletPublicKey } = props;

  const user = useSelector(userSelector);
  const fioWalletsTxHistory = useSelector(fioWalletsTxHistorySelector);

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const userFioWalletsTxHistory = useMemo(
    () => fioWalletsTxHistory[user.id] || {},
    [fioWalletsTxHistory, user.id],
  );
  const updateHistory = useCallback(
    (history: FioWalletTxHistory, publicKey: string) => {
      dispatch(updateWalletsTxHistory(history, publicKey, user.id));
    },
    [user.id, dispatch],
  );

  const fetchWalletTxHistory = useCallback(async () => {
    if (isLoading) {
      log.info('Still fetching wallet transactions.');
      return;
    }
    setIsLoading(true);
    const currentHistory: FioWalletTxHistory = userFioWalletsTxHistory[
      walletPublicKey
    ] ?? {
      lastTxActionTime: '',
      txs: [],
    };
    await checkTransactions(
      walletPublicKey,
      { ...currentHistory },
      updateHistory,
    );
    setIsLoading(false);
  }, [isLoading, walletPublicKey, updateHistory, userFioWalletsTxHistory]);

  useEffectOnce(() => {
    fetchWalletTxHistory();
  }, [fetchWalletTxHistory]);

  useInterval(() => {
    fetchWalletTxHistory();
  }, TIMER_DELAY);

  return null;
};
