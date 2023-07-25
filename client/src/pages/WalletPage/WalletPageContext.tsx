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

import {
  PAGE_TYPES,
  PAGE_TYPES_PROPS,
} from '../../components/WelcomeComponent/constants';
import { DEFAULT_BALANCES } from '../../util/prices';

import {
  AllFioNamesAndWalletsProps,
  FioAddressDoublet,
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
  showPrivateKeyModal: boolean;
  showWalletNameEdit: boolean;
  welcomeComponentProps: {
    noPaddingTop: boolean;
    onlyActions: boolean;
    pageType: PAGE_TYPES_PROPS;
  } & AllFioNamesAndWalletsProps;
  closeWalletNameEdit: () => void;
  onKeyShow: () => void;
  onShowPrivateModalClose: () => void;
  onWalletUpdated: () => void;
};

export const useContext = (): UseContextProps => {
  const fioWalletsData = useSelector(fioWalletsDataSelector);
  const fioWalletsTxHistory = useSelector(fioWalletsTxHistorySelector);
  const profileRefreshed = useSelector(profileRefreshedSelector);

  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [showWalletNameEdit, setShowWalletNameEdit] = useState(false);
  const [error, setError] = useState<string>('');

  const queryParams = useQuery();
  const publicKey = queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);
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
    fioWallet => fioWallet.publicKey === publicKey,
  );
  const fioWalletData = userId
    ? fioWalletsData[userId][fioWallet.publicKey]
    : null;
  const fioWalletTxHistory =
    userId && fioWalletsTxHistory
      ? fioWalletsTxHistory[userId][fioWallet.publicKey]
      : null;

  const fioWalletBalance =
    fioWalletsBalances.wallets[fioWallet.publicKey] || DEFAULT_BALANCES;

  const hasNoTransactions =
    fioWalletBalance.total.nativeFio === 0 &&
    fioWalletTxHistory?.txs.length === 0;

  useEffect(() => {
    if (publicKey && profileRefreshed && !fioWallet)
      setError(`FIO Wallet (${publicKey}) is not available`);
  }, [publicKey, fioWallet, profileRefreshed]);

  const onShowPrivateModalClose = useCallback(
    () => setShowPrivateKeyModal(false),
    [],
  );
  const closeWalletNameEdit = useCallback(
    () => setShowWalletNameEdit(false),
    [],
  );

  const onKeyShow = useCallback(() => setShowPrivateKeyModal(true), []);

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
    showPrivateKeyModal,
    showWalletNameEdit,
    welcomeComponentProps,
    closeWalletNameEdit,
    onKeyShow,
    onShowPrivateModalClose,
    onWalletUpdated,
  };
};
