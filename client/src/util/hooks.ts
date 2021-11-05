import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getFioAddresses } from '../redux/fio/actions';

import { fioWallets } from '../redux/fio/selectors';
import {
  isAuthenticated,
  isNotActiveUser as isNotActiveUserSelector,
} from '../redux/profile/selectors';

import { FioWalletDoublet } from '../types';
import { ROUTES } from '../constants/routes';

export function useFioAddresses(limit = 0, offset = 0) {
  const dispatch = useDispatch();
  const wallets = useSelector(fioWallets);
  const isAuth = useSelector(isAuthenticated);
  useEffect(() => {
    if (wallets.length > 0 && isAuth) {
      wallets.map((wallet: FioWalletDoublet) =>
        dispatch(getFioAddresses(wallet.publicKey, limit, offset)),
      );
    }
  }, [fioWallets.length]);
}

export function useNonActiveUserRedirect() {
  const isNotActiveUser = useSelector(isNotActiveUserSelector);
  const isAuth = useSelector(isAuthenticated);
  const history = useHistory();
  useEffect(() => {
    if (isAuth && isNotActiveUser) {
      history.push(ROUTES.USER_IS_NOT_ACTIVE);
    }
  }, [isAuth, isNotActiveUser]);
}
