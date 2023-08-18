import { useCallback, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';

import apis from '../../api';
import { log } from '../../util/general';

import { FIO_REQUEST_STATUS_TYPES } from '../../constants/fio';

import { FioRecord } from '../../types';

type UseContextProps = {
  fioPublicKeyHasRequest: string | undefined;
};

export const useContext = (): UseContextProps => {
  const fioWallets = useSelector(fioWalletsSelector);

  const [receivedFioRequests, setReceivedFioRequests] = useState<{
    [key: string]: FioRecord[];
  }>({});
  const [fioPublicKeyHasRequest, setFioPublicKeyHasRequest] = useState<
    string | null
  >(null);

  const getReceivedFioRequestsForWallet = useCallback(
    async (publicKey: string) => {
      try {
        const fetchedReceivedFioRequests =
          (await apis.fio.getReceivedFioRequests(publicKey)) || [];
        setReceivedFioRequests({ [publicKey]: fetchedReceivedFioRequests });
      } catch (err) {
        log.error(err);
      }
    },
    [],
  );

  useEffect(() => {
    for (const wallet of fioWallets) {
      getReceivedFioRequestsForWallet(wallet.publicKey);
    }
  }, [fioWallets, getReceivedFioRequestsForWallet]);

  useEffect(() => {
    Object.entries(receivedFioRequests).forEach(
      ([publicKey, receivedFioRequest]) => {
        if (receivedFioRequest.length) {
          const lastRequest = receivedFioRequest.find(
            receivedFioRequestItem =>
              receivedFioRequestItem.status ===
              FIO_REQUEST_STATUS_TYPES.PENDING,
          );

          if (lastRequest) {
            setFioPublicKeyHasRequest(publicKey);
          }
        }
      },
    );
  }, [receivedFioRequests]);

  return {
    fioPublicKeyHasRequest,
  };
};
