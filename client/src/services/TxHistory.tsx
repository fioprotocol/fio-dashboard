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
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [userFioWalletsTxHistory, setUserFioWalletsTxHistory] = useState<{
    [publicKey: string]: FioWalletTxHistory;
  }>(fioWalletsTxHistory[user.id]);
  const updateHistory = (history: FioWalletTxHistory, publicKey: string) =>
    updateWalletsTxHistory(history, publicKey, user.id);

  const getWalletsData = async (walletsState?: FioWalletDoublet[]) => {
    if (!isLoading) {
      setIsLoading(true);
      await Promise.all(
        (walletsState || fioWallets).map(async wallet => {
          const currentHistory: FioWalletTxHistory = userFioWalletsTxHistory[
            wallet.publicKey
          ] ?? {
            highestTxHeight: 0,
            txs: [],
          };
          await checkTransactions(
            wallet.publicKey,
            { ...currentHistory },
            updateHistory,
          );
          return;
        }),
      );
      setIsLoading(false);
    }
  };

  const getPublicKeyData = async (wallet: FioWalletDoublet) => {
    if (!isLoading) {
      setIsLoading(true);
      const currentHistory = userFioWalletsTxHistory[wallet.publicKey] ?? {
        highestTxHeight: 0,
        txs: [],
      };
      await checkTransactions(
        wallet.publicKey,
        { ...currentHistory },
        updateHistory,
      );
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
      getPublicKeyData(wallet);
    }
  }, [walletDataPublicKey, JSON.stringify(fioWallets)]);

  useEffect(() => {
    if (user && user.id) {
      setUserFioWalletsTxHistory(fioWalletsTxHistory[user.id] || {});
    }
  }, [user, fioWalletsTxHistory]);

  useInterval(() => {
    getWalletsData();
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
  },
);

export default compose(reduxConnect)(TxHistory);
