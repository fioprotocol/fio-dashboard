import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  getAllFioPubAddresses,
  refreshBalance,
  refreshFioNames,
} from '../../redux/fio/actions';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioDomains as fioDomainsSelector,
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  isFioWalletsBalanceLoading as isFioWalletsBalanceLoadingSelector,
  loading as fioLoadingSelector,
  mappedPublicAddresses as mappedPublicAddressesSelector,
  walletsFioAddressesLoading as walletsFioAddressesLoadingSelector,
} from '../../redux/fio/selectors';

import { loading as edgeLoadingSelector } from '../../redux/edge/selectors';

import useEffectOnce from '../../hooks/general';
import { useCheckIfDesktop } from '../../screenType';

import {
  FIO_101_SLIDER_CONTENT,
  Fio101SliderContentProps,
} from './components/Fio101Component/constants';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { WalletBalancesItem } from '../../types';

type UseContextProps = {
  fio101Items: Fio101SliderContentProps[];
  isDesktop: boolean;
  isFioWalletsBalanceLoading: boolean;
  loading: boolean;
  totalBalance: WalletBalancesItem;
  totalBalanceLoading: boolean;
};

export const useContext = (): UseContextProps => {
  const fioWallets = useSelector(fioWalletsSelector);
  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const fioLoading = useSelector(fioLoadingSelector);
  const fioAddresses = useSelector(fioAddressesSelector);
  const fioDomains = useSelector(fioDomainsSelector);
  const mappedPublicAddresses = useSelector(mappedPublicAddressesSelector);
  const edgeLoading = useSelector(edgeLoadingSelector);
  const fioAddressesLoading = useSelector(fioAddressesLoadingSelector);
  const walletsFioAddressesLoading = useSelector(
    walletsFioAddressesLoadingSelector,
  );
  const isFioWalletsBalanceLoading = useSelector(
    isFioWalletsBalanceLoadingSelector,
  );

  const dispatch = useDispatch();

  const [fio101Items, setFio101Items] = useState<Fio101SliderContentProps[]>(
    [],
  );

  const loading =
    fioLoading ||
    edgeLoading ||
    fioAddressesLoading ||
    walletsFioAddressesLoading;
  const hasFCH = fioAddresses?.length > 0;
  const hasOneFCH = fioAddresses?.length === 1;

  const hasDomains = fioDomains?.length > 0;

  const totalBalance = fioWalletsBalances?.total?.total;

  const noMappedPubAddresses =
    !isEmpty(mappedPublicAddresses) &&
    Object.values(mappedPublicAddresses).every(
      mappedPubicAddress => mappedPubicAddress.publicAddresses.length === 0,
    );

  const firstFromListFioAddressName = fioAddresses[0]?.name;

  const isDesktop = useCheckIfDesktop();

  useEffectOnce(
    () => {
      for (const { publicKey } of fioWallets) {
        dispatch(refreshBalance(publicKey));
        dispatch(refreshFioNames(publicKey));
      }
    },
    [fioWallets, dispatch],
    fioWallets.length > 0,
  );

  useEffectOnce(
    () => {
      for (const fioAddress of fioAddresses) {
        dispatch(getAllFioPubAddresses(fioAddress.name, 0, 0));
      }
    },
    [dispatch, fioAddresses],
    fioAddresses.length > 0,
  );

  useEffect(() => {
    if (!loading) {
      let fio101ItemsArr = [
        FIO_101_SLIDER_CONTENT.DEFAULT,
        FIO_101_SLIDER_CONTENT.NO_FCH,
        FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
        FIO_101_SLIDER_CONTENT.NO_DOMAINS,
      ];

      if (hasFCH && !hasDomains) {
        fio101ItemsArr = [
          FIO_101_SLIDER_CONTENT.NO_DOMAINS,
          FIO_101_SLIDER_CONTENT.DEFAULT,
          FIO_101_SLIDER_CONTENT.NO_FCH,
          FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
        ];
      }

      if (hasFCH && noMappedPubAddresses) {
        if (hasOneFCH) {
          fio101ItemsArr = [
            {
              ...FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
              link:
                FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES.oneItemLink +
                `?${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${firstFromListFioAddressName}`,
            },
            FIO_101_SLIDER_CONTENT.NO_DOMAINS,
            FIO_101_SLIDER_CONTENT.DEFAULT,
            FIO_101_SLIDER_CONTENT.NO_FCH,
          ];
        } else {
          fio101ItemsArr = [
            FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
            FIO_101_SLIDER_CONTENT.NO_DOMAINS,
            FIO_101_SLIDER_CONTENT.DEFAULT,
            FIO_101_SLIDER_CONTENT.NO_FCH,
          ];
        }
      }

      if (!hasFCH) {
        fio101ItemsArr = [
          FIO_101_SLIDER_CONTENT.NO_FCH,
          FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
          FIO_101_SLIDER_CONTENT.NO_DOMAINS,
          FIO_101_SLIDER_CONTENT.DEFAULT,
        ];
      }

      setFio101Items(fio101ItemsArr);
    }
  }, [
    firstFromListFioAddressName,
    hasDomains,
    hasFCH,
    hasOneFCH,
    loading,
    noMappedPubAddresses,
  ]);

  return {
    isDesktop,
    fio101Items,
    loading,
    isFioWalletsBalanceLoading,
    totalBalance,
    totalBalanceLoading: isFioWalletsBalanceLoading,
  };
};
