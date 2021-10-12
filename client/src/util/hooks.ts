import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFioAddresses } from '../redux/fio/actions';

import { fioWallets } from '../redux/fio/selectors';
import { isAuthenticated } from '../redux/profile/selectors';

import { FioWalletDoublet } from '../types';

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
