import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { toggleTokenListInfoBadge } from '../../redux/fio/actions';
import {
  currentFioAddress as currentFioAddressSelector,
  loading as loadingSelector,
  showTokenListInfoBadge as showTokenListInfoBadgeSelector,
} from '../../redux/fio/selectors';

import { usePublicAddresses } from '../../util/hooks';
import useQuery from '../../hooks/useQuery';
import { useGetMappedErrorRedirect } from '../../hooks/fio';

import { CHAIN_CODES } from '../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { PublicAddressDoublet } from '../../types';

type Props = {
  loading: boolean;
  fioCryptoHandlePub: PublicAddressDoublet;
  fioCryptoHandleName: string;
  publicAddresses: PublicAddressDoublet[];
  search: string;
  showBadge: boolean;
  onClose: () => void;
};

export const useContext = (): Props => {
  const queryParams = useQuery();
  const fioCryptoHandleName = queryParams.get(
    QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE,
  );

  const currentFioAddress = useSelector(state =>
    currentFioAddressSelector(state, fioCryptoHandleName),
  );
  const loading = useSelector(loadingSelector);
  const showTokenListInfoBadge = useSelector(showTokenListInfoBadgeSelector);

  const dispatch = useDispatch();

  usePublicAddresses(fioCryptoHandleName);
  useGetMappedErrorRedirect(fioCryptoHandleName);

  const [showBadge, toggleShowBadge] = useState<boolean>(false);

  const { publicAddresses, walletPublicKey } = currentFioAddress || {};

  useEffect(() => {
    // show info badge if only FIO linked
    toggleShowBadge(
      showTokenListInfoBadge &&
        publicAddresses != null &&
        publicAddresses.length === 0,
    );
  }, [publicAddresses, showTokenListInfoBadge]);

  const onClose = () => dispatch(toggleTokenListInfoBadge(false));
  const search = `?${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${fioCryptoHandleName}`;

  const fioCryptoHandlePub = {
    chainCode: CHAIN_CODES.FIO,
    tokenCode: CHAIN_CODES.FIO,
    publicAddress: walletPublicKey,
  };

  return {
    fioCryptoHandlePub,
    fioCryptoHandleName,
    loading,
    publicAddresses: publicAddresses.filter(
      publicAddress => publicAddress.chainCode !== CHAIN_CODES.SOCIALS,
    ),
    search,
    showBadge,
    onClose,
  };
};
