import React, { useEffect, useState } from 'react';
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

const TIMER_DELAY = 5000; // 5 sec

const TxHistory = (props: Props): React.FC => {
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
  const updateHistory = (history: FioWalletTxHistory, publicKey: string) => {
    updateWalletsTxHistory(history, publicKey, user.id);
    refreshBalance(publicKey);
  };

  const fetchWalletTxHistory = async (wallet: FioWalletDoublet) => {
    const currentHistory: FioWalletTxHistory = userFioWalletsTxHistory[
      wallet.publicKey
    ] ?? {
      highestTxHeight: -1,
      txs: [],
    };
    await checkTransactions(
      wallet.publicKey,
      { ...currentHistory },
      updateHistory,
    );
  };

  const fetchWalletsTxHistory = async (walletsState?: FioWalletDoublet[]) => {
    if (!isLoading) {
      setIsLoading(true);
      await Promise.all(
        (walletsState || fioWallets).map(async wallet =>
          fetchWalletTxHistory(wallet),
        ),
      );
      setIsLoading(false);
    }
  };

  const forceWalletHistoryFetch = async (wallet: FioWalletDoublet) => {
    if (!isLoading) {
      setIsLoading(true);
      await fetchWalletTxHistory(wallet);
      refreshWalletDataPublicKey('');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (walletDataPublicKey) {
      const wallet = fioWallets.find(
        walletItem => walletItem.publicKey === walletDataPublicKey,
      );

      if (!wallet) return;
      forceWalletHistoryFetch(wallet);
    }
  }, [walletDataPublicKey, JSON.stringify(fioWallets)]);

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
