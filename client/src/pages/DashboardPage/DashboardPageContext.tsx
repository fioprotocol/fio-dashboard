import { useDispatch, useSelector } from 'react-redux';

import { refreshBalance } from '../../redux/fio/actions';

import {
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  loading as fioLoadingSelector,
} from '../../redux/fio/selectors';

import useEffectOnce from '../../hooks/general';
import { useCheckIfDesktop } from '../../screenType';

import { WalletBalancesItem } from '../../types';

type UseContextProps = {
  isDesktop: boolean;
  totalBalance: WalletBalancesItem;
  totalBalanceLoading: boolean;
};

export const useContext = (): UseContextProps => {
  const fioWallets = useSelector(fioWalletsSelector);
  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const fioLoading = useSelector(fioLoadingSelector);

  const dispatch = useDispatch();

  const isDesktop = useCheckIfDesktop();

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
    isDesktop,
    totalBalance: fioWalletsBalances?.total?.total,
    totalBalanceLoading: fioLoading,
  };
};
