import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';

import { camelizeFioRequestsData, compose } from '../utils';

import { fioWallets } from '../redux/fio/selectors';
import { user } from '../redux/profile/selectors';
import {
  CamelCasedFioRequestData,
  FioWalletData,
  FioWalletDoublet,
  User,
} from '../types';
import apis from '../api';
import { updateFioWalletsData } from '../redux/fioWalletsData/actions';

type Props = {
  fioWallets: FioWalletDoublet[];
  user: User;
  updateFioWalletsData: (data: FioWalletData, publicKey: string) => void;
};

const getWalletData = async (
  fioWallet: FioWalletDoublet,
  user: User,
  updateLocalFioWalletData: (
    data: FioWalletData,
    publicKey: string,
    userId: string,
  ) => void,
) => {
  const publicWalletFioSdk = apis.fio.createPublicWalletFioSdk({
    public: fioWallet.publicKey,
  });
  let receivedFioRequests: CamelCasedFioRequestData[] | null = null;
  let sentFioRequests: CamelCasedFioRequestData[] | null = null;
  let obtData: CamelCasedFioRequestData[] | null = null;

  const promises = [];

  const getReceivedFioRequestsPromise = new Promise((resolve, reject) => {
    return publicWalletFioSdk
      .getReceivedFioRequests(0, 0, true)
      .then((res: any) => {
        receivedFioRequests = camelizeFioRequestsData(
          res?.requests?.length ? res.requests.reverse() : [],
        );
        resolve();
      })
      .catch((e: any) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve();
      });
  });
  promises.push(getReceivedFioRequestsPromise);

  const getSentFioRequestsPromise = new Promise((resolve, reject) => {
    return publicWalletFioSdk
      .getSentFioRequests(0, 0, true)
      .then((res: any) => {
        sentFioRequests = camelizeFioRequestsData(
          res?.requests?.length ? res.requests.reverse() : [],
        );
        resolve();
      })
      .catch((e: any) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve();
      });
  });
  promises.push(getSentFioRequestsPromise);

  const getObtDataPromise = new Promise((resolve, reject) => {
    return publicWalletFioSdk
      .getObtData()
      .then((res: any) => {
        obtData = camelizeFioRequestsData(
          res?.obt_data_records?.length ? res.obt_data_records.reverse() : [],
        );
        resolve();
      })
      .catch((e: any) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve();
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

const TIMER_DELAY = 20000; // 20 sec

const WalletsDataFlow = (props: Props & RouterProps): React.FC => {
  const { fioWallets, user, updateFioWalletsData } = props;

  const timerId = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const getWalletsData = async () => {
    if (!isLoading) {
      setIsLoading(true);
      await Promise.all(
        fioWallets.map(async wallet => {
          await getWalletData(wallet, user, updateFioWalletsData);
          return;
        }),
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timerId.current) clearInterval(timerId.current);

    if (fioWallets?.length) {
      getWalletsData();
      timerId.current = setInterval(getWalletsData, TIMER_DELAY);
    }

    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, [fioWallets.length]);

  return null;
};

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    user,
  }),
  {
    updateFioWalletsData,
  },
);

export default withRouter(compose(reduxConnect)(WalletsDataFlow));
