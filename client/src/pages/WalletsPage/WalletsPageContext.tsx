import { useCallback, useEffect, useState } from 'react';

import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { LocationState } from 'history';

import { resetAddWalletSuccess } from '../../redux/account/actions';

import { toggleIsWalletCreated } from '../../redux/account/actions';

import { fioWalletsBalances as fioWalletsBalancesSelector } from '../../redux/fio/selectors';
import { user as userSelector } from '../../redux/profile/selectors';

import {
  PAGE_TYPES,
  PAGE_TYPES_PROPS,
} from '../../components/WelcomeComponent/constants';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { USER_PROFILE_TYPE } from '../../constants/profile';

import { useGetAllFioNamesAndWallets } from '../../hooks/fio';
import useQuery from '../../hooks/useQuery';

import {
  AllFioNamesAndWalletsProps,
  FioWalletDoublet,
  WalletsBalances,
} from '../../types';

const AUTOCLOSE_CREATE_WALLET_TIME = 10000;

type UseContextProps = {
  fioWallets: FioWalletDoublet[];
  fioWalletsBalances: WalletsBalances;
  isAlternativeAccountType: boolean;
  showCreateWalletModal: boolean;
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
  const user = useSelector(userSelector);

  const [showCreateWalletModal, setShowCreateWalletModal] = useState<boolean>(
    false,
  );
  const [showWalletImported, setShowWalletImported] = useState<boolean>(false);
  const [showWalletCreated, setShowWalletCreated] = useState<boolean>(false);
  const [showWalletDeleted, setShowWalletDeleted] = useState<boolean>(false);

  const dispatch = useDispatch();

  const queryParams = useQuery();
  const history = useHistory();
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

  const closeCreateWallet = useCallback(
    () => setShowCreateWalletModal(false),
    [],
  );
  const closeImportedWallet = useCallback(
    () => setShowWalletImported(false),
    [],
  );
  const closeCreatedWallet = useCallback(() => {
    dispatch(toggleIsWalletCreated(false));
    setShowWalletCreated(false);
  }, [dispatch]);
  const closeDeletedWallet = useCallback(() => setShowWalletDeleted(false), []);

  const onAdd = useCallback(() => {
    setShowCreateWalletModal(true);
  }, []);

  const onWalletCreated = useCallback(() => {
    setShowCreateWalletModal(false);
    setShowWalletCreated(true);
    dispatch(resetAddWalletSuccess());
  }, [dispatch]);

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
      setShowWalletCreated(false);
    }, AUTOCLOSE_CREATE_WALLET_TIME);

    if (!showWalletCreated) {
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, [showWalletCreated]);

  useEffect(() => {
    return () => {
      toggleIsWalletCreated(false);
      const newLocation = {
        ...history.location,
        state: null as LocationState,
      };
      history.push(newLocation);
    };
  }, [history]);

  return {
    fioWallets,
    fioWalletsBalances,
    isAlternativeAccountType:
      user?.userProfileType === USER_PROFILE_TYPE.ALTERNATIVE,
    showCreateWalletModal,
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
