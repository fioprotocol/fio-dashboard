import { useCallback, useEffect, useState } from 'react';

import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import { fioWalletsBalances as fioWalletsBalancesSelector } from '../../redux/fio/selectors';

import {
  PAGE_TYPES,
  PAGE_TYPES_PROPS,
} from '../../components/WelcomeComponent/constants';

import { useGetAllFioNamesAndWallets } from '../../hooks/fio';
import {
  AllFioNamesAndWalletsProps,
  FioWalletDoublet,
  WalletsBalances,
} from '../../types';
import useQuery from '../../hooks/useQuery';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

const AUTOCLOSE_TIME = 5000;
const AUTOCLOSE_CREATE_WALLET_TIME = 10000;

type UseContextProps = {
  fioWallets: FioWalletDoublet[];
  fioWalletsBalances: WalletsBalances;
  showCreateWallet: boolean;
  showWalletCreated: boolean;
  showWalletDeleted: boolean;
  showWalletImported: boolean;
  welcomeComponentProps: {
    noPaddingTop: boolean;
    onlyActions: boolean;
    pageType: PAGE_TYPES_PROPS;
  } & AllFioNamesAndWalletsProps;
  closeCreateWallet: () => void;
  closeCreatedWallet: () => void;
  closeDeletedWallet: () => void;
  closeImportedWallet: () => void;
  onAdd: () => void;
  onWalletCreated: () => void;
};

export const useContext = (): UseContextProps => {
  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const [showCreateWallet, setShowCreateWallet] = useState<boolean>(false);
  const [showWalletImported, setShowWalletImported] = useState<boolean>(false);
  const [showWalletCreated, setShowWalletCreated] = useState<boolean>(false);
  const [showWalletDeleted, setShowWalletDeleted] = useState<boolean>(false);

  const queryParams = useQuery();
  const importedWallet = queryParams.get(QUERY_PARAMS_NAMES.IMPORTED);
  const location = useLocation<{ walletDeleted: boolean }>();
  const { walletDeleted } = location?.state || {};

  const allFioNamesAndWallets = useGetAllFioNamesAndWallets();
  const { fioWallets } = allFioNamesAndWallets;

  const welcomeComponentProps = {
    ...allFioNamesAndWallets,
    noPaddingTop: true,
    onlyActions: true,
    pageType: PAGE_TYPES.TOK,
  };

  const closeCreateWallet = useCallback(() => setShowCreateWallet(false), []);
  const closeImportedWallet = useCallback(
    () => setShowWalletImported(false),
    [],
  );
  const closeCreatedWallet = useCallback(() => setShowWalletCreated(false), []);
  const closeDeletedWallet = useCallback(() => setShowWalletDeleted(false), []);

  const onAdd = useCallback(() => {
    setShowCreateWallet(true);
  }, []);
  const onWalletCreated = useCallback(() => {
    setShowCreateWallet(false);
    setShowWalletCreated(true);
  }, []);

  useEffect(() => {
    if (importedWallet) {
      setShowWalletImported(true);
    }
  }, [importedWallet]);

  useEffect(() => {
    if (walletDeleted) {
      setShowWalletDeleted(true);
    }
  }, [walletDeleted]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowWalletDeleted(false);
    }, AUTOCLOSE_TIME);

    if (!showWalletDeleted) {
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, [showWalletDeleted]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowWalletCreated(false);
    }, AUTOCLOSE_CREATE_WALLET_TIME);

    if (!showWalletCreated) {
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, [showWalletCreated]);

  return {
    fioWallets,
    fioWalletsBalances,
    showCreateWallet,
    showWalletCreated,
    showWalletDeleted,
    showWalletImported,
    welcomeComponentProps,
    closeCreateWallet,
    closeCreatedWallet,
    closeDeletedWallet,
    closeImportedWallet,
    onAdd,
    onWalletCreated,
  };
};
