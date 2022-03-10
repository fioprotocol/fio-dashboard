import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  getWalletsFioAddresses,
  getAllFioPubAddresses,
  refreshBalance,
} from '../redux/fio/actions';

import {
  fioWallets,
  mappedPublicAddresses,
  fioAddresses,
  walletsFioAddressesLoading,
  fioWalletsBalances,
} from '../redux/fio/selectors';
import {
  isAuthenticated,
  isNewUser as isNewUserSelector,
  isNewEmailNotVerified as isNewEmailNotVerifiedSelector,
} from '../redux/profile/selectors';
import { roe } from '../redux/registrations/selectors';

import apis from '../api';

import { ROUTES } from '../constants/routes';
import { DEFAULT_BALANCES } from './prices';

import {
  FioNameItemProps,
  FioWalletDoublet,
  FioAddressDoublet,
  WalletBalances,
} from '../types';
import { getElementByFioName } from '../utils';
import { emptyWallet } from '../redux/fio/reducer';

export function useFioAddresses(
  publicKey?: string,
): [FioAddressDoublet[], boolean] {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthenticated);
  const wallets: FioWalletDoublet[] = useSelector(fioWallets);
  const fioCryptoHandles: FioAddressDoublet[] = useSelector(fioAddresses);
  const isLoading: boolean = useSelector(walletsFioAddressesLoading);

  useEffect(() => {
    if (publicKey && isAuth) {
      dispatch(getWalletsFioAddresses([publicKey]));
    }
  }, [publicKey, isAuth]);

  useEffect(() => {
    if (wallets.length > 0 && isAuth && !publicKey) {
      dispatch(getWalletsFioAddresses(wallets.map(wallet => wallet.publicKey)));
    }
  }, [wallets.length, isAuth, publicKey]);

  const retFioCryptoHandles = (publicKey
    ? fioCryptoHandles.filter(
        fioCryptoHandle => fioCryptoHandle.walletPublicKey === publicKey,
      )
    : fioCryptoHandles
  ).sort((fioAddress1: FioAddressDoublet, fioAddress2: FioAddressDoublet) =>
    fioAddress1.name > fioAddress2.name ? 1 : -1,
  );

  return [retFioCryptoHandles, isLoading];
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

export function usePubAddressesFromWallet(walletPublicKey?: string) {
  const dispatch = useDispatch();

  const fioAddressToPubAddresses = useSelector(mappedPublicAddresses);
  const [fioCryptoHandles] = useFioAddresses(walletPublicKey);

  const fetchPublicAddresses = (items: FioAddressDoublet[]) => {
    for (const { name } of items) {
      dispatch(getAllFioPubAddresses(name, 0, 0));
    }
  };

  useEffect(() => {
    if (fioCryptoHandles.length < 1) return;
    fetchPublicAddresses(fioCryptoHandles);
  }, [fioCryptoHandles.length]);

  return fioAddressToPubAddresses;
}

export function useRoe() {
  const roeCoefficient = useSelector(roe);

  return roeCoefficient || null;
}

export function useConvertFioToUsdc({
  fioAmount,
  nativeAmount,
}: {
  fioAmount?: number;
  nativeAmount?: number;
}) {
  const roeAmount = useSelector(roe);

  if (!fioAmount && !nativeAmount && !roeAmount) return null;

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

export function useWalletBalances(publicKey: string): WalletBalances {
  const walletsBalances = useSelector(fioWalletsBalances);

  return walletsBalances.wallets[publicKey] || DEFAULT_BALANCES;
}
