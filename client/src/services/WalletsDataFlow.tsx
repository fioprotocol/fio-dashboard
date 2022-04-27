import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { ReceivedFioRequestsResponse } from '@fioprotocol/fiosdk/src/entities/ReceivedFioRequestsResponse';
import { SentFioRequestResponse } from '@fioprotocol/fiosdk/src/entities/SentFioRequestsResponse';
import { GetObtDataResponse } from '@fioprotocol/fiosdk/src/entities/GetObtDataResponse';

import apis from '../api';

import { camelizeFioRequestsData, compose } from '../utils';
import useInterval from '../util/hooks';

import {
  updateFioWalletsData,
  refreshWalletDataPublicKey,
} from '../redux/fioWalletsData/actions';

import { walletDataPublicKey } from '../redux/fioWalletsData/selectors';
import { userId } from '../redux/profile/selectors';
import { fioWalletsIdKeys } from '../redux/fio/selectors';

import {
  FioRecord,
  FioWalletData,
  ResponseFioRecord,
  FioApiError,
} from '../types';
import { FIOSDK_LIB } from '../api/fio';

type WalletsServiceCommonProps = {
  userId: string;
  walletDataPublicKey: string;
  updateFioWalletsData: (data: FioWalletData, publicKey: string) => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
};
type WalletsServiceProps = {
  fioWalletsIdKeys: { id: string; publicKey: string }[];
} & WalletsServiceCommonProps;

type WalletServiceProps = {
  fioWallet: { id: string; publicKey: string };
} & WalletsServiceCommonProps;

// todo: handle chunk case in promises
const getWalletData = async (
  fioWalletId: string,
  publicKey: string,
  userId: string,
  updateLocalFioWalletData: (
    data: FioWalletData,
    publicKey: string,
    userId: string,
  ) => void,
  publicWalletFioSdk: FIOSDK_LIB | null,
): Promise<void> => {
  if (!publicWalletFioSdk) return;
  let receivedFioRequests: FioRecord[] | null = null;
  let sentFioRequests: FioRecord[] | null = null;
  let obtData: FioRecord[] | null = null;

  const promises = [];

  const getReceivedFioRequestsPromise = new Promise((resolve, reject) => {
    return publicWalletFioSdk
      .getReceivedFioRequests(0, 0, true)
      .then((res: ReceivedFioRequestsResponse) => {
        receivedFioRequests = camelizeFioRequestsData(
          res?.requests?.length ? res.requests.reverse() : [],
        );
        resolve(null);
      })
      .catch((e: FioApiError) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve(null);
      });
  });
  promises.push(getReceivedFioRequestsPromise);

  const getSentFioRequestsPromise = new Promise((resolve, reject) => {
    return publicWalletFioSdk
      .getSentFioRequests(0, 0, true)
      .then((res: SentFioRequestResponse) => {
        sentFioRequests = camelizeFioRequestsData(
          res?.requests?.length ? res.requests.reverse() : [],
        );
        resolve(null);
      })
      .catch((e: FioApiError) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve(null);
      });
  });
  promises.push(getSentFioRequestsPromise);

  const getObtDataPromise = new Promise((resolve, reject) => {
    return publicWalletFioSdk
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
      .catch((e: FioApiError) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve(null);
      });
  });
  promises.push(getObtDataPromise);

  await Promise.all(promises);

  const walletData = {
    id: fioWalletId,
    receivedFioRequests,
    sentFioRequests,
    obtData,
  };

  updateLocalFioWalletData(walletData, publicKey, userId);
};

const TIMER_DELAY = 10000; // 10 sec

const WalletDataFlow = (props: WalletServiceProps): null => {
  const {
    fioWallet: { id, publicKey },
    userId,
    walletDataPublicKey,
    updateFioWalletsData,
    refreshWalletDataPublicKey,
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [
    publicWalletFioSdk,
    setPublicWalletFioSdk,
  ] = useState<FIOSDK_LIB | null>(null);

  const refreshWalletData = useCallback(
    async (publicWalletFioSdkState?: FIOSDK_LIB): Promise<void> => {
      if (!isLoading) {
        setIsLoading(true);

        await getWalletData(
          id,
          publicKey,
          userId,
          updateFioWalletsData,
          publicWalletFioSdk || publicWalletFioSdkState,
        );
        setIsLoading(false);
      }
    },
    [
      id,
      publicKey,
      isLoading,
      publicWalletFioSdk,
      userId,
      updateFioWalletsData,
    ],
  );

  // set wallet sdk
  useEffect(() => {
    if (publicKey && !publicWalletFioSdk) {
      const walletFioSdk = apis.fio.createPublicWalletFioSdk({
        public: publicKey,
      });
      refreshWalletData(walletFioSdk);
      setPublicWalletFioSdk(walletFioSdk);
    }
  }, [publicKey, publicWalletFioSdk, refreshWalletData]);

  // refresh data out of queue
  useEffect(() => {
    if (walletDataPublicKey && walletDataPublicKey === publicKey) {
      refreshWalletData();
      refreshWalletDataPublicKey('');
    }
  }, [
    walletDataPublicKey,
    publicKey,
    refreshWalletData,
    refreshWalletDataPublicKey,
  ]);

  useInterval(() => {
    refreshWalletData();
  }, TIMER_DELAY);

  return null;
};

const WalletsDataFlow = (props: WalletsServiceProps): React.ReactElement[] => {
  const { fioWalletsIdKeys, ...rest } = props;

  return fioWalletsIdKeys.map(
    (fioWallet: { id: string; publicKey: string }) => (
      <WalletDataFlow
        key={fioWallet.publicKey}
        fioWallet={fioWallet}
        {...rest}
      />
    ),
  );
};

const reduxConnect = connect(
  createStructuredSelector({
    fioWalletsIdKeys,
    userId,
    walletDataPublicKey,
  }),
  {
    updateFioWalletsData,
    refreshWalletDataPublicKey,
  },
);

export default compose(reduxConnect)(WalletsDataFlow);
