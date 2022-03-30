import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { ReceivedFioRequestsResponse } from '@fioprotocol/fiosdk/src/entities/ReceivedFioRequestsResponse';
import { SentFioRequestResponse } from '@fioprotocol/fiosdk/src/entities/SentFioRequestsResponse';
import { GetObtDataResponse } from '@fioprotocol/fiosdk/src/entities/GetObtDataResponse';

import { camelizeFioRequestsData, compose } from '../utils';

import { fioWallets } from '../redux/fio/selectors';
import { walletDataPublicKey } from '../redux/fioWalletsData/selectors';
import { user } from '../redux/profile/selectors';
import {
  FioRecord,
  FioWalletDoublet,
  FioWalletData,
  User,
  ResponseFioRecord,
} from '../types';
import apis from '../api';
import {
  updateFioWalletsData,
  refreshWalletDataPublicKey,
} from '../redux/fioWalletsData/actions';
import useInterval from '../util/hooks';

type Props = {
  fioWallets: FioWalletDoublet[];
  user: User;
  walletDataPublicKey: string;
  updateFioWalletsData: (data: FioWalletData, publicKey: string) => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
};

// todo: handle chunk case in promises
const getWalletData = async (
  fioWallet: FioWalletDoublet,
  user: User,
  updateLocalFioWalletData: (
    data: FioWalletData,
    publicKey: string,
    userId: string,
  ) => void,
) => {
  let receivedFioRequests: FioRecord[] | null = null;
  let sentFioRequests: FioRecord[] | null = null;
  let obtData: FioRecord[] | null = null;

  const promises = [];

  const getReceivedFioRequestsPromise = new Promise((resolve, reject) => {
    return fioWallet.publicWalletFioSdk
      .getReceivedFioRequests(0, 0, true)
      .then((res: ReceivedFioRequestsResponse) => {
        receivedFioRequests = camelizeFioRequestsData(
          res?.requests?.length ? res.requests.reverse() : [],
        );
        resolve(null);
      })
      .catch((e: any) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve(null);
      });
  });
  promises.push(getReceivedFioRequestsPromise);

  const getSentFioRequestsPromise = new Promise((resolve, reject) => {
    return fioWallet.publicWalletFioSdk
      .getSentFioRequests(0, 0, true)
      .then((res: SentFioRequestResponse) => {
        sentFioRequests = camelizeFioRequestsData(
          res?.requests?.length ? res.requests.reverse() : [],
        );
        resolve(null);
      })
      .catch((e: any) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve(null);
      });
  });
  promises.push(getSentFioRequestsPromise);

  const getObtDataPromise = new Promise((resolve, reject) => {
    return fioWallet.publicWalletFioSdk
      .getObtData()
      .then((res: GetObtDataResponse) => {
        obtData = camelizeFioRequestsData(
          res?.obt_data_records?.length
            ? res.obt_data_records.sort(
                (a: ResponseFioRecord, b: ResponseFioRecord) =>
                  new Date(b.time_stamp).getTime() -
                  new Date(a.time_stamp).getTime(),
              )
            : [],
        );
        resolve(null);
      })
      .catch((e: any) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve(null);
      });
  });
  promises.push(getObtDataPromise);

  await Promise.all(promises);

  const walletData = {
    id: fioWallet.id,
    receivedFioRequests,
    sentFioRequests,
    obtData,
  };

  updateLocalFioWalletData(walletData, fioWallet.publicKey, user.id);
};

const TIMER_DELAY = 5000; // 5 sec

const WalletsDataFlow = (props: Props): React.FC | null => {
  const {
    fioWallets,
    user,
    walletDataPublicKey,
    updateFioWalletsData,
    refreshWalletDataPublicKey,
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wallets, setWallets] = useState<FioWalletDoublet[]>([]);

  const getWalletsData = async (walletsState?: FioWalletDoublet[]) => {
    if (!isLoading) {
      setIsLoading(true);
      await Promise.all(
        (walletsState || wallets).map(async wallet => {
          await getWalletData(wallet, user, updateFioWalletsData);
          return;
        }),
      );
      setIsLoading(false);
    }
  };

  const getPublicKeyData = async (wallet: FioWalletDoublet) => {
    if (!isLoading) {
      setIsLoading(true);
      await getWalletData(wallet, user, updateFioWalletsData);
      refreshWalletDataPublicKey('');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fioWallets?.length) {
      let newWalletsState;
      if (fioWallets.length > wallets.length) {
        const newWallets = fioWallets
          .filter(fw => {
            return !wallets.filter(w => w.publicKey === fw.publicKey).length;
          })
          .map(nw => ({
            ...nw,
            publicWalletFioSdk: apis.fio.createPublicWalletFioSdk({
              public: nw.publicKey,
            }),
          }));
        newWalletsState = [...wallets, ...newWallets];
      }

      if (fioWallets.length < wallets.length) {
        newWalletsState = wallets.filter(w => {
          return !!fioWallets.filter(fw => fw.publicKey === w.publicKey).length;
        });
      }

      if (newWalletsState) setWallets(newWalletsState);

      getWalletsData(newWalletsState);
    }
  }, [fioWallets.length]);

  useEffect(() => {
    if (walletDataPublicKey) {
      const wallet = wallets.find(
        walletItem => walletItem.publicKey === walletDataPublicKey,
      );

      if (!wallet) return;
      getPublicKeyData(wallet);
    }
  }, [walletDataPublicKey, JSON.stringify(wallets)]);

  useInterval(() => {
    getWalletsData();
  }, TIMER_DELAY);

  return null;
};

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    user,
    walletDataPublicKey,
  }),
  {
    updateFioWalletsData,
    refreshWalletDataPublicKey,
  },
);

export default compose(reduxConnect)(WalletsDataFlow);
