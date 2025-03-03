import {
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getAllFioPubAddresses,
  getWalletsFioAddresses,
  refreshBalance,
} from '../redux/fio/actions';

import {
  fioAddresses,
  fioWallets,
  fioWalletsBalances,
  mappedPublicAddresses,
  walletsFioAddressesLoading,
} from '../redux/fio/selectors';
import { isAuthenticated } from '../redux/profile/selectors';
import { roe } from '../redux/registrations/selectors';

import { getElementByFioName } from '../utils';
import useEffectOnce from '../hooks/general';

import apis from '../api';

import { DEFAULT_BALANCES } from './prices';
import { emptyWallet } from '../redux/fio/reducer';

import {
  FioAddressDoublet,
  FioNameItemProps,
  FioWalletDoublet,
  MappedPublicAddresses,
  WalletBalances,
} from '../types';

export function useFioAddresses(
  publicKey?: string,
): [FioAddressDoublet[], boolean] {
  const [resultFioAddressesList, setResultFioAddressesList] = useState([]);

  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthenticated);
  const wallets: FioWalletDoublet[] = useSelector(fioWallets);
  const fioCryptoHandles: FioAddressDoublet[] = useSelector(fioAddresses);
  const isLoading: boolean = useSelector(walletsFioAddressesLoading);

  const walletsKeysDiffString = wallets
    .map(it => it.publicKey)
    .sort()
    .join(';');

  useEffect(() => {
    if (!isAuth) return;

    if (publicKey) {
      dispatch(getWalletsFioAddresses([publicKey]));
    } else if (wallets.length > 0) {
      dispatch(getWalletsFioAddresses(wallets.map(wallet => wallet.publicKey)));
    }
  }, [publicKey, isAuth, walletsKeysDiffString, dispatch]);

  useEffect(() => {
    setResultFioAddressesList(
      (publicKey
        ? fioCryptoHandles.filter(
            fioCryptoHandle => fioCryptoHandle.walletPublicKey === publicKey,
          )
        : fioCryptoHandles
      ).sort((fioAddress1: FioAddressDoublet, fioAddress2: FioAddressDoublet) =>
        fioAddress1.name > fioAddress2.name ? 1 : -1,
      ),
    );
  }, [fioCryptoHandles, publicKey]);

  return [resultFioAddressesList, isLoading];
}

export function useFioWallet(
  fioNameList: FioNameItemProps[],
  name: string,
): { currentWallet: FioWalletDoublet; settingWallet: boolean } {
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
  }, [wallets, fioNameList, name, isAuth]);

  useEffect(() => {
    if (publicKey != null && publicKey) {
      dispatch(refreshBalance(publicKey));
      setWalletSetting(false);
    }
  }, [publicKey, dispatch]);

  // FioWalletDoublet
  const wallet: FioWalletDoublet =
    wallets &&
    wallets.find(
      (walletItem: FioWalletDoublet) => walletItem.publicKey === publicKey,
    );

  return { currentWallet: wallet || emptyWallet, settingWallet };
}

export function usePublicAddresses(
  fioAddress: string,
  limit: number = 0,
): void {
  const [offset, setOffset] = useState(0);

  const dispatch = useDispatch();

  const fioAddressToPubAddresses = useSelector(mappedPublicAddresses);
  const hasMore =
    fioAddressToPubAddresses[fioAddress] &&
    fioAddressToPubAddresses[fioAddress].more;

  const fetchPublicAddresses = useCallback(
    (incOffset: number = 0) =>
      dispatch(getAllFioPubAddresses(fioAddress, limit, incOffset)),
    [dispatch, fioAddress, limit],
  );

  useEffectOnce(() => {
    if (!fioAddress) return;
    fetchPublicAddresses();
  }, [fioAddress, fetchPublicAddresses]);

  useEffect(() => {
    if (hasMore) {
      const incOffset = offset + limit;
      fetchPublicAddresses(incOffset);
      setOffset(incOffset);
    }
  }, [hasMore, limit, offset, fetchPublicAddresses, setOffset]);
}

export function usePubAddressesFromWallet(
  walletPublicKey?: string,
): MappedPublicAddresses {
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

export function useRoe(): string | null {
  const roeCoefficient = useSelector(roe);

  return roeCoefficient || null;
}

export function useConvertFioToUsdc({
  fioAmount,
  nativeAmount,
}: {
  fioAmount?: string;
  nativeAmount?: string;
}): string | null {
  const roeAmount = useSelector(roe);

  if ((!fioAmount && !nativeAmount) || !roeAmount) return null;

  const fioSuf =
    nativeAmount !== null && nativeAmount !== undefined
      ? nativeAmount
      : apis.fio.amountToSUF(fioAmount);

  return apis.fio.convertFioToUsdc(fioSuf, roeAmount);
}

export function useInterval(callback: () => void, delay: number | null): void {
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

export function useFieldElemActiveState(): [boolean, () => void, () => void] {
  const [fieldElemActive, setFieldElemActive] = useState(false);

  const setActive = () => setFieldElemActive(true);
  const setInactive = () => setFieldElemActive(false);

  return [fieldElemActive, setActive, setInactive];
}
