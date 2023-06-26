import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { toggleSocialMediaListInfoBadge } from '../../redux/fio/actions';

import {
  currentFioAddress as currentFioAddressSelector,
  loading as loadingSelector,
  showSocialMediaListInfoBadge as showSocialMediaListInfoBadgeSelector,
} from '../../redux/fio/selectors';

import { usePublicAddresses } from '../../util/hooks';
import useQuery from '../../hooks/useQuery';

import { CHAIN_CODES } from '../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { PublicAddressDoublet } from '../../types';

type UseContextProps = {
  loading: boolean;
  fch: string;
  search: string;
  showBadge: boolean;
  socialMediaLinks: PublicAddressDoublet[];
  onClose: () => void;
};

export const useContext = (): UseContextProps => {
  const queryParams = useQuery();
  const fch = queryParams.get(QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE);

  const showBadge = useSelector(showSocialMediaListInfoBadgeSelector);
  const currentFioAddress = useSelector(state =>
    currentFioAddressSelector(state, fch),
  );
  const loading = useSelector(loadingSelector);

  const dispatch = useDispatch();

  usePublicAddresses(fch);

  const search = `?${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${fch}`;

  const { publicAddresses = [] } = currentFioAddress || {};

  const onClose = useCallback(() => {
    dispatch(toggleSocialMediaListInfoBadge(false));
  }, [dispatch]);

  return {
    fch,
    loading,
    search,
    showBadge,
    socialMediaLinks: publicAddresses.filter(
      publicAddress => publicAddress.chainCode === CHAIN_CODES.SOCIALS,
    ),
    onClose,
  };
};
