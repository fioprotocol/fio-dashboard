import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  updateWalletsTxHistory,
  refreshWalletDataPublicKey,
} from '../redux/fioWalletsData/actions';

import { fioWallets } from '../redux/fio/selectors';
import {
  fioWalletsTxHistory,
  walletDataPublicKey,
} from '../redux/fioWalletsData/selectors';
import { user } from '../redux/profile/selectors';

import { compose } from '../utils';
import useInterval from '../util/hooks';
import { checkTransactions } from '../util/transactions';

import {
  FioWalletTxHistory,
  FioWalletDoublet,
  User,
  UsersWalletsTxHistory,
} from '../types';
import { refreshBalance } from '../redux/fio/actions';

type Props = {
  fioWalletsTxHistory: UsersWalletsTxHistory;
  fioWallets: FioWalletDoublet[];
  user: User;
  walletDataPublicKey: string;
  updateWalletsTxHistory: (
    data: FioWalletTxHistory,
    publicKey: string,
    userId: string,
  ) => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
  refreshBalance: (publicKey: string) => void;
};

const TIMER_DELAY = 8000; // 8 sec

const TxHistory = (props: Props): React.FC | null => {
  const {
    fioWalletsTxHistory,
    fioWallets,
    user,
    walletDataPublicKey,
    updateWalletsTxHistory,
    refreshWalletDataPublicKey,
    refreshBalance,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [userFioWalletsTxHistory, setUserFioWalletsTxHistory] = useState<{
    [publicKey: string]: FioWalletTxHistory;
  }>(fioWalletsTxHistory[user.id]);
  const updateHistory = useCallback(
    (history: FioWalletTxHistory, publicKey: string) => {
      updateWalletsTxHistory(history, publicKey, user.id);
      refreshBalance(publicKey);
    },
    [refreshBalance, updateWalletsTxHistory, user.id],
  );

  const fetchWalletTxHistory = useCallback(
    async (walletPublicKey: string) => {
      const currentHistory: FioWalletTxHistory = userFioWalletsTxHistory[
        walletPublicKey
      ] ?? {
        highestTxHeight: -1,
        txs: [],
      };
      await checkTransactions(
        walletPublicKey,
        { ...currentHistory },
        updateHistory,
      );
    },
    [updateHistory, userFioWalletsTxHistory],
  );

  const fetchWalletsTxHistory = async (): Promise<void> => {
    if (!isLoading) {
      setIsLoading(true);
      await Promise.all(
        fioWallets.map(async wallet => fetchWalletTxHistory(wallet.publicKey)),
      );
      setIsLoading(false);
    }
  };

  const forceWalletHistoryFetch = useCallback(
    async (walletPublicKey: string): Promise<void> => {
      if (!isLoading) {
        setIsLoading(true);
        await fetchWalletTxHistory(walletPublicKey);
        setIsLoading(false);
      }
    },
    [isLoading, fetchWalletTxHistory],
  );

  useEffect(() => {
    if (walletDataPublicKey) {
      refreshWalletDataPublicKey('');
      forceWalletHistoryFetch(walletDataPublicKey);
    }
  }, [
    walletDataPublicKey,
    forceWalletHistoryFetch,
    refreshWalletDataPublicKey,
  ]);

  useEffect(() => {
    if (user && user.id) {
      setUserFioWalletsTxHistory(fioWalletsTxHistory[user.id] || {});
    }
  }, [user, fioWalletsTxHistory]);

  useInterval(() => {
    fetchWalletsTxHistory();
  }, TIMER_DELAY);

  return null;
};

const reduxConnect = connect(
  createStructuredSelector({
    fioWalletsTxHistory,
    fioWallets,
    user,
    walletDataPublicKey,
  }),
  {
    updateWalletsTxHistory,
    refreshWalletDataPublicKey,
    refreshBalance,
  },
);

export default compose(reduxConnect)(TxHistory);
