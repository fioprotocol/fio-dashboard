import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import {
  getAllFioPubAddresses,
  refreshBalance,
  refreshFioNames,
  resetMappedPubAddressError,
} from '../redux/fio/actions';
import { checkRecoveryQuestions, setPinEnabled } from '../redux/edge/actions';
import { getUserWallets } from '../redux/profile/actions';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioDomains as fioDomainsSelector,
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  getMappedPubAddressError as getMappedPubAddressErrorSelector,
  isFioWalletsBalanceLoading as isFioWalletsBalanceLoadingSelector,
  loading as fioLoadingSelector,
  mappedPublicAddresses as mappedPublicAddressesSelector,
  walletsFioAddressesLoading as walletsFioAddressesLoadingSelector,
} from '../redux/fio/selectors';
import { loading as edgeLoadingSelector } from '../redux/edge/selectors';
import { user as userSelector } from '../redux/profile/selectors';

import useEffectOnce from './general';
import { isDomainExpired } from '../util/fio';
import apis from '../api';
import { log } from '../util/general';

import { NOT_FOUND } from '../constants/errors';
import { ROUTES } from '../constants/routes';

import { AllFioNamesAndWalletsProps } from '../types';

const REDIRECT_TIMEOUT = 500;

export const useGetMappedErrorRedirect = async (
  fioCryptoHandleName: string | null,
): Promise<void> => {
  const history = useHistory();
  const dispatch = useDispatch();

  const getMappedPubAddressError = useSelector(
    getMappedPubAddressErrorSelector,
  );

  useEffect(() => {
    if (!fioCryptoHandleName || getMappedPubAddressError === NOT_FOUND) {
      dispatch(resetMappedPubAddressError());
      setTimeout(() => {
        history.push(ROUTES.FIO_ADDRESSES);
      }, REDIRECT_TIMEOUT);
    }
  }, [dispatch, fioCryptoHandleName, getMappedPubAddressError, history]);
};

export const useGetAllFioNamesAndWallets = (): AllFioNamesAndWalletsProps => {
  const edgeLoading = useSelector(edgeLoadingSelector);
  const fioAddresses = useSelector(fioAddressesSelector);
  const fioDomains = useSelector(fioDomainsSelector);
  const fioLoading = useSelector(fioLoadingSelector);
  const fioAddressesLoading = useSelector(fioAddressesLoadingSelector);
  const fioWallets = useSelector(fioWalletsSelector);
  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const isFioWalletsBalanceLoading = useSelector(
    isFioWalletsBalanceLoadingSelector,
  );
  const mappedPublicAddresses = useSelector(mappedPublicAddressesSelector);
  const user = useSelector(userSelector);
  const walletsFioAddressesLoading = useSelector(
    walletsFioAddressesLoadingSelector,
  );

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const dispatch = useDispatch();

  const hasAffiliate = !!user?.affiliateProfile;
  const hasNoEmail = !user?.email;

  const hasFCH = fioAddresses?.length > 0;
  const hasOneFCH = fioAddresses?.length === 1;

  const hasDomains = fioDomains?.length > 0;
  const hasAddresses = fioAddresses?.length > 0;
  const hasOneDomain = fioDomains?.length === 1;
  const hasExpiredDomains = fioDomains.some(fioDomain =>
    isDomainExpired(fioDomain.name, fioDomain.expiration),
  );

  const noMappedPubAddresses =
    !isEmpty(mappedPublicAddresses) &&
    Object.values(mappedPublicAddresses).every(
      mappedPubicAddress => mappedPubicAddress.publicAddresses.length === 0,
    );

  const firstFromListFioAddressName = fioAddresses[0]?.name;
  const firstFromListFioDomainName = fioDomains[0]?.name;
  const firstFromListFioWalletPublicKey = fioWallets[0]?.publicKey;

  const hasNoStakedTokens = fioWalletsBalances.total?.staked?.nativeFio === 0;
  const totalBalance = fioWalletsBalances?.total?.total;
  const hasZeroTotalBalance = totalBalance?.nativeFio === 0;

  const loading =
    !initialLoadComplete ||
    fioLoading ||
    edgeLoading ||
    fioAddressesLoading ||
    isFioWalletsBalanceLoading ||
    walletsFioAddressesLoading;

  const fetchData = useCallback(async () => {
    const token = apis.client.getToken();
    if (token) {
      await Promise.all([
        dispatch(getUserWallets()),
        ...fioWallets.map(wallet => dispatch(refreshBalance(wallet.publicKey))),
        ...fioWallets.map(wallet =>
          dispatch(refreshFioNames(wallet.publicKey)),
        ),
        ...fioAddresses.map(address =>
          dispatch(getAllFioPubAddresses(address.name, 0, 0)),
        ),
      ]);
    }
    setInitialLoadComplete(true);
  }, [dispatch, fioAddresses, fioWallets]);

  useEffectOnce(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user?.username) {
      dispatch(checkRecoveryQuestions(user.username));
      dispatch(setPinEnabled(user.username));
    }
  }, [dispatch, user?.username]);

  return {
    firstFromListFioAddressName,
    firstFromListFioDomainName,
    firstFromListFioWalletPublicKey,
    fioAddresses,
    fioDomains,
    fioWallets,
    fioWalletsBalances,
    isFioWalletsBalanceLoading,
    hasAffiliate,
    hasDomains,
    hasAddresses,
    hasExpiredDomains,
    hasFCH,
    hasOneDomain,
    hasOneFCH,
    hasNoEmail,
    hasNoStakedTokens,
    hasZeroTotalBalance,
    loading,
    noMappedPubAddresses,
    userId: user?.id,
    userType: user?.userProfileType,
  };
};

export const useRefreshBalancesAndFioNames = () => {
  const fioWallets = useSelector(fioWalletsSelector);

  const dispatch = useDispatch();

  useEffectOnce(
    () => {
      for (const fioWallet of fioWallets) {
        if (fioWallet.publicKey) {
          dispatch(refreshBalance(fioWallet.publicKey));
          dispatch(refreshFioNames(fioWallet.publicKey));
        }
      }
    },
    [],
    !!fioWallets?.length,
  );
};

export const useGetAccountPublicKey = (
  account: string,
): { loading: boolean; accountPublicKey: string } => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [accountPublicKey, setAccountPublicKey] = useState<string | null>(null);

  const getAccountPubKey = useCallback(async (account: string) => {
    try {
      toggleLoading(true);
      const publicKey = await apis.fio.getAccountPubKey(account);
      setAccountPublicKey(publicKey);
    } catch (error) {
      log.error(error);
    } finally {
      toggleLoading(false);
    }
  }, []);

  useEffect(() => {
    if (account) {
      getAccountPubKey(account);
    }
  }, [account, getAccountPubKey]);

  return { loading, accountPublicKey };
};
