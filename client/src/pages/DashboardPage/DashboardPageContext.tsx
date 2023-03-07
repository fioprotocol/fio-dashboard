import { useDispatch, useSelector } from 'react-redux';

import { refreshBalance } from '../../redux/fio/actions';

import {
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  loading as fioLoadingSelector,
} from '../../redux/fio/selectors';

import useEffectOnce from '../../hooks/general';

import { WalletBalancesItem } from '../../types';

type UseContextProps = {
  totalBalance: WalletBalancesItem;
  totalBalanceLoading: boolean;
};

export const useContext = (): UseContextProps => {
  const fioWallets = useSelector(fioWalletsSelector);
  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const fioLoading = useSelector(fioLoadingSelector);

  const dispatch = useDispatch();

  useEffectOnce(
    () => {
      for (const { publicKey } of fioWallets) {
        dispatch(refreshBalance(publicKey));
      }
    },
    [fioWallets, dispatch, refreshBalance],
    fioWallets.length > 0,
  );

  return {
    totalBalance: fioWalletsBalances?.total?.total,
    totalBalanceLoading: fioLoading,
  };
};
