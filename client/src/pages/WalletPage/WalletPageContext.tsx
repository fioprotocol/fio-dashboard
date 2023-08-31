import { useCallback, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { profileRefreshed as profileRefreshedSelector } from '../../redux/profile/selectors';
import {
  fioWalletsData as fioWalletsDataSelector,
  fioWalletsTxHistory as fioWalletsTxHistorySelector,
} from '../../redux/fioWalletsData/selectors';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { useGetAllFioNamesAndWallets } from '../../hooks/fio';
import useQuery from '../../hooks/useQuery';
import useEffectOnce from '../../hooks/general';
import { log } from '../../util/general';

import {
  PAGE_TYPES,
  PAGE_TYPES_PROPS,
} from '../../components/WelcomeComponent/constants';
import { WALLET_TABS_LIST } from './components/WalletTabs';
import { FIO_RECORD_TYPES } from './constants';

import { DEFAULT_BALANCES } from '../../util/prices';

import apis from '../../api';

import {
  AllFioNamesAndWalletsProps,
  FioAddressDoublet,
  FioRecord,
  FioWalletData,
  FioWalletDoublet,
  FioWalletTxHistory,
  WalletBalances,
} from '../../types';

type UseContextProps = {
  error: string;
  fioCryptoHandles: FioAddressDoublet[];
  fioWallet: FioWalletDoublet;
  fioWalletBalance: WalletBalances;
  fioWalletData: FioWalletData;
  fioWalletTxHistory: FioWalletTxHistory;
  hasNoTransactions: boolean;
  isOpenLockedList: boolean;
  showWalletSettings: boolean;
  showWalletNameEdit: boolean;
  receivedFioRequests: FioRecord[];
  sentFioRequests: FioRecord[];
  obtData: FioRecord[];
  obtDataLoading: boolean;
  sentFioRequestsLoading: boolean;
  receivedFioRequestsLoading: boolean;
  welcomeComponentProps: {
    noPaddingTop: boolean;
    onlyActions: boolean;
    pageType: PAGE_TYPES_PROPS;
  } & AllFioNamesAndWalletsProps;
  closeWalletNameEdit: () => void;
  onKeyShow: () => void;
  onShowPrivateModalClose: () => void;
  onWalletUpdated: () => void;
  tabAction: (tabKey: string) => void;
};

export const useContext = (): UseContextProps => {
  const fioWalletsData = useSelector(fioWalletsDataSelector);
  const fioWalletsTxHistory = useSelector(fioWalletsTxHistorySelector);
  const profileRefreshed = useSelector(profileRefreshedSelector);

  const [showWalletSettings, toggleShowWalletSettings] = useState(false);
  const [showWalletNameEdit, setShowWalletNameEdit] = useState(false);
  const [error, setError] = useState<string>('');
  const [receivedFioRequests, setReceivedFioRequests] = useState<FioRecord[]>(
    [],
  );
  const [sentFioRequests, setSentFioRequests] = useState<FioRecord[]>([]);
  const [obtData, setObtData] = useState<FioRecord[]>([]);
  const [sentFioRequestsLoading, toggleSentFioRequestsLoading] = useState<
    boolean
  >(false);
  const [
    receivedFioRequestsLoading,
    toggleReceivedFioRequestsLoading,
  ] = useState<boolean>(false);
  const [obtDataLoading, toggleObtDataLoading] = useState<boolean>(false);

  const queryParams = useQuery();
  const publicKey =
    queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY) ||
    (window.location.search &&
      window.location.search
        .split(`${QUERY_PARAMS_NAMES.PUBLIC_KEY}=`)[1]
        .split('&')[0]);
  const location = useLocation<{ isOpenLockedList: boolean }>();
  const { isOpenLockedList = false } = location?.state || {};

  const allFioNamesAndWallets = useGetAllFioNamesAndWallets();
  const {
    fioAddresses,
    fioWallets,
    fioWalletsBalances,
    userId,
  } = allFioNamesAndWallets;

  const fioCryptoHandles = fioAddresses.filter(
    fioAddress => fioAddress.walletPublicKey === publicKey,
  );

  const fioWallet = fioWallets.find(
    fioWallet => fioWallet?.publicKey === publicKey,
  );
  const fioWalletData =
    userId && fioWalletsData[userId]
      ? fioWalletsData[userId][fioWallet?.publicKey]
      : null;
  const fioWalletTxHistory =
    userId && fioWalletsTxHistory && fioWalletsTxHistory[userId]
      ? fioWalletsTxHistory[userId][fioWallet?.publicKey]
      : null;

  const fioWalletBalance =
    fioWalletsBalances.wallets[fioWallet?.publicKey] || DEFAULT_BALANCES;

  const hasNoTransactions =
    fioWalletBalance.total.nativeFio === 0 &&
    fioWalletTxHistory?.txs.length === 0;

  const getReceivedFioRequests = useCallback(async () => {
    try {
      toggleReceivedFioRequestsLoading(true);

      const receivedFioRequests = await apis.fio.getReceivedFioRequests(
        publicKey,
      );

      setReceivedFioRequests(receivedFioRequests?.reverse());
    } catch (err) {
      log.error(err);
    } finally {
      toggleReceivedFioRequestsLoading(false);
    }
  }, [publicKey]);

  const getSentFioRequests = useCallback(async () => {
    try {
      toggleSentFioRequestsLoading(true);
      const sentFioRequests = await apis.fio.getSentFioRequests(publicKey);
      setSentFioRequests(sentFioRequests?.reverse());
    } catch (err) {
      log.error(err);
    } finally {
      toggleSentFioRequestsLoading(false);
    }
  }, [publicKey]);

  const getObtData = useCallback(async () => {
    try {
      toggleObtDataLoading(true);
      const obtData = await apis.fio.getObtData(publicKey);
      setObtData(
        obtData?.sort(
          (a: FioRecord, b: FioRecord) =>
            new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime(),
        ),
      );
    } catch (err) {
      log.error(err);
    } finally {
      toggleObtDataLoading(false);
    }
  }, [publicKey]);

  const tabAction = useCallback(
    async (tabKey: string) => {
      if (tabKey === WALLET_TABS_LIST[1].eventKey) {
        await getObtData();
      }

      if (tabKey === FIO_RECORD_TYPES.SENT) {
        await getObtData();
        await getSentFioRequests();
      }

      if (tabKey === FIO_RECORD_TYPES.RECEIVED) {
        await getObtData();
        await getReceivedFioRequests();
      }
    },
    [getObtData, getReceivedFioRequests, getSentFioRequests],
  );

  const getFioRequests = useCallback(() => {
    getReceivedFioRequests();
    getSentFioRequests();
    getObtData();
  }, [getReceivedFioRequests, getSentFioRequests, getObtData]);

  useEffect(() => {
    if (publicKey && profileRefreshed && !fioWallet)
      setError(`FIO Wallet (${publicKey}) is not available`);
  }, [publicKey, fioWallet, profileRefreshed]);

  useEffectOnce(() => {
    getFioRequests();
  }, [getFioRequests]);

  const onShowPrivateModalClose = useCallback(
    () => toggleShowWalletSettings(false),
    [],
  );
  const closeWalletNameEdit = useCallback(
    () => setShowWalletNameEdit(false),
    [],
  );

  const onKeyShow = useCallback(() => toggleShowWalletSettings(true), []);

  const onWalletUpdated = useCallback(() => {
    closeWalletNameEdit();
  }, [closeWalletNameEdit]);

  const welcomeComponentProps = {
    ...allFioNamesAndWallets,
    noPaddingTop: true,
    onlyActions: true,
    pageType: PAGE_TYPES.TOK,
  };

  return {
    error,
    fioCryptoHandles,
    fioWallet,
    fioWalletBalance,
    fioWalletData,
    fioWalletTxHistory,
    hasNoTransactions,
    isOpenLockedList,
    showWalletSettings,
    showWalletNameEdit,
    receivedFioRequests,
    sentFioRequests,
    obtData,
    obtDataLoading,
    sentFioRequestsLoading,
    receivedFioRequestsLoading,
    welcomeComponentProps,
    closeWalletNameEdit,
    onKeyShow,
    onShowPrivateModalClose,
    onWalletUpdated,
    tabAction,
  };
};
