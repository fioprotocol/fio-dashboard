import { useSelector } from 'react-redux';

import {
  fioWallets as fioWalletsSelector,
  loading as loadingSelector,
} from '../../redux/fio/selectors';
import { noProfileLoaded as noProfileLoadedSelector } from '../../redux/profile/selectors';

import { useCheckIfDesktop } from '../../screenType';

import { FioWalletDoublet } from '../../types';

type UseContextProps = {
  fioWallets: FioWalletDoublet[];
  isDesktop: boolean;
  loading: boolean;
  noProfileLoaded: boolean;
};

export const useContext = (): UseContextProps => {
  const fioWallets = useSelector(fioWalletsSelector);
  const loading = useSelector(loadingSelector);
  const noProfileLoaded = useSelector(noProfileLoadedSelector);

  const isDesktop = useCheckIfDesktop();

  return {
    fioWallets,
    isDesktop,
    loading,
    noProfileLoaded,
  };
};
