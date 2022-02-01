import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  getFioAddresses,
  getAllFioPubAddresses,
  refreshBalance,
} from '../redux/fio/actions';

import {
  fioWallets,
  mappedPublicAddresses,
  fioAddresses,
} from '../redux/fio/selectors';
import {
  isAuthenticated,
  isNewUser as isNewUserSelector,
  isNewEmailNotVerified as isNewEmailNotVerifiedSelector,
} from '../redux/profile/selectors';

import { roe } from '../redux/registrations/selectors';

import apis from '../api';

import { ROUTES } from '../constants/routes';

import {
  FioNameItemProps,
  FioWalletDoublet,
  FioAddressDoublet,
} from '../types';
import { getElementByFioName } from '../utils';
import { emptyWallet } from '../redux/fio/reducer';

export function useFioAddresses(
  publicKey?: string,
  limit = 0,
  offset = 0,
): FioAddressDoublet[] {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthenticated);
  const wallets: FioWalletDoublet[] = useSelector(fioWallets);
  const fioCryptoHandles: FioAddressDoublet[] = useSelector(fioAddresses);

  const getFioCryptoHandles = (
    walletPublicKey: string,
    limitValue: number,
    offsetValue: number,
  ) => {
    dispatch(getFioAddresses(walletPublicKey, limitValue, offsetValue));
  };

  useEffect(() => {
    if (publicKey && isAuth) {
      getFioCryptoHandles(publicKey, limit, offset);
    }
  }, [publicKey, isAuth]);

  useEffect(() => {
    if (wallets.length > 0 && isAuth && !publicKey) {
      wallets.map(wallet =>
        getFioCryptoHandles(wallet.publicKey, limit, offset),
      );
    }
  }, [wallets.length, isAuth, publicKey]);

  const retFioCryptoHandles = publicKey
    ? fioCryptoHandles.filter(
        fioCryptoHandle => fioCryptoHandle.walletPublicKey === publicKey,
      )
    : fioCryptoHandles;

  return retFioCryptoHandles;
}

export function useFioWallet(fioNameList: FioNameItemProps[], name: string) {
  const dispatch = useDispatch();

  const [publicKey, setPublicKey] = useState('');
  const [settingWallet, setWalletSetting] = useState(true);

  const wallets = useSelector(fioWallets);
  const isAuth = useSelector(isAuthenticated);

  useEffect(() => {
    if (wallets.length > 0 && isAuth) {
      const selected = getElementByFioName({ fioNameList, name });
      setPublicKey((selected && selected.walletPublicKey) || '');
    }
  }, [wallets, fioNameList, name]);

  useEffect(() => {
    if (publicKey != null && publicKey) {
      dispatch(refreshBalance(publicKey));
      setWalletSetting(false);
    }
  }, [publicKey]);

  // FioWalletDoublet
  const wallet: FioWalletDoublet =
    wallets &&
    wallets.find(
      (walletItem: FioWalletDoublet) => walletItem.publicKey === publicKey,
    );

  return { currentWallet: wallet || emptyWallet, settingWallet };
}

export function useNonActiveUserRedirect() {
  const isNewUser = useSelector(isNewUserSelector);
  const isNewEmailNotVerified = useSelector(isNewEmailNotVerifiedSelector);
  const isAuth = useSelector(isAuthenticated);
  const history = useHistory();
  useEffect(() => {
    if (isAuth && isNewEmailNotVerified) {
      history.push(ROUTES.NEW_EMAIL_NOT_VERIFIED);
    }
    if (isAuth && isNewUser) {
      history.push(ROUTES.IS_NEW_USER);
    }
  }, [isAuth, isNewUser, isNewEmailNotVerified]);
}

export function usePublicAddresses(fioAddress: string, limit: number = 0) {
  const [offset, setOffset] = useState(0);

  const dispatch = useDispatch();

  const fioAddressToPubAddresses = useSelector(mappedPublicAddresses);
  const hasMore =
    fioAddressToPubAddresses[fioAddress] &&
    fioAddressToPubAddresses[fioAddress].more;

  const fetchPublicAddresses = (incOffset: number = 0) =>
    dispatch(getAllFioPubAddresses(fioAddress, limit, incOffset));

  useEffect(() => {
    if (!fioAddress) return;
    fetchPublicAddresses();
  }, []);

  useEffect(() => {
    if (hasMore) {
      const incOffset = offset + limit;
      fetchPublicAddresses(incOffset);
      setOffset(incOffset);
    }
  }, [hasMore]);
}

export function useConvertFioToUsdc({
  fioAmount,
  nativeAmount,
}: {
  fioAmount?: number;
  nativeAmount?: number;
}) {
  const roeAmount = useSelector(roe);

  if (!fioAmount && !nativeAmount) return null;

  const fioSuf =
    nativeAmount != null ? nativeAmount : apis.fio.amountToSUF(fioAmount);

  return apis.fio.convertFioToUsdc(fioSuf, roeAmount);
}

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
