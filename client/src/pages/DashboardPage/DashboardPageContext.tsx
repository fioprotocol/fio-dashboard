import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import superagent from 'superagent';

import {
  getAllFioPubAddresses,
  refreshBalance,
  refreshFioNames,
} from '../../redux/fio/actions';
import {
  checkRecoveryQuestions,
  setPinEnabled,
} from '../../redux/edge/actions';

import {
  fioAddresses as fioAddressesSelector,
  fioDomains as fioDomainsSelector,
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  loading as fioLoadingSelector,
  mappedPublicAddresses as mappedPublicAddressesSelector,
} from '../../redux/fio/selectors';

import {
  hasRecoveryQuestions as hasRecoveryQuestionsSelector,
  isPinEnabled as isPinEnabledSelector,
} from '../../redux/edge/selectors';

import { user as userSelector } from '../../redux/profile/selectors';

import useEffectOnce from '../../hooks/general';
import { useCheckIfDesktop } from '../../screenType';
import { isDomainExpired } from '../../util/fio';
import { log } from '../../util/general';

import {
  WELCOME_COMPONENT_ITEM_CONTENT,
  WelcomeItemProps,
} from './components/WelcomeComponentItem/constants';
import {
  FIO_101_SLIDER_CONTENT,
  Fio101SliderContentProps,
} from './components/Fio101Component/constants';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { WalletBalancesItem } from '../../types';

const APY_URL = 'https://services-external.fioprotocol.io/staking';

type UseContextProps = {
  fio101Items: Fio101SliderContentProps[];
  firstWelcomeItem: WelcomeItemProps | null;
  secondWelcomeItem: WelcomeItemProps | null;
  isDesktop: boolean;
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
  const user = useSelector(userSelector);
  const hasRecoveryQuestions = useSelector(hasRecoveryQuestionsSelector);
  const isPinEnabled = useSelector(isPinEnabledSelector);

  const dispatch = useDispatch();

  const [APY, setAPY] = useState<string>(null);

  const hasFCH = fioAddresses?.length > 0;
  const hasOneFCH = fioAddresses?.length === 1;

  const hasDomains = fioDomains?.length > 0;
  const hasOneDomain = fioDomains?.length === 1;

  const fioAddressesJSON = JSON.stringify(fioAddresses);
  const totalBalance = fioWalletsBalances?.total?.total;

  const isDesktop = useCheckIfDesktop();

  const getAPY = useCallback(async () => {
    try {
      const response = await superagent.post(APY_URL);
      const { historical_apr } = response.body || {};

      if (historical_apr?.['30day']) {
        setAPY(historical_apr['30day'].toFixed(2));
      }
    } catch (error) {
      log.error(error);
    }
  }, []);

  useEffectOnce(
    () => {
      for (const { publicKey } of fioWallets) {
        dispatch(refreshBalance(publicKey));
      }
    },
    [fioWallets, dispatch, refreshBalance],
    fioWallets.length > 0,
  );

  useEffectOnce(() => {
    getAPY();
  }, []);

  useEffect(() => {
    if (user.username) {
      dispatch(checkRecoveryQuestions(user.username));
      dispatch(setPinEnabled(user.username));
    }
  }, [dispatch, user.username]);

  useEffect(() => {
    for (const fioWallet of fioWallets) {
      dispatch(refreshFioNames(fioWallet.publicKey));
    }
  }, [dispatch, fioWallets]);

  useEffect(() => {
    const fioAddresseParsed = JSON.parse(fioAddressesJSON);
    for (const fioAddress of fioAddresseParsed) {
      dispatch(getAllFioPubAddresses(fioAddress.name, 0, 0));
    }
  }, [dispatch, fioAddressesJSON]);

  let firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.OPEN_SEA;
  let secondWelcomeItem = null;

  if (hasDomains) {
    secondWelcomeItem = firstWelcomeItem;
    if (hasOneDomain) {
      firstWelcomeItem = {
        ...WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN,
        actionButtonLink:
          WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN.actionButtonLink +
          `?${QUERY_PARAMS_NAMES.NAME}=${fioDomains[0]?.name}`,
      };
    } else {
      firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN;
    }
  }

  if (hasDomains) {
    secondWelcomeItem = firstWelcomeItem;
    firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.GET_ANOTHER_FIO_DOMAIN;
  }

  if (hasDomains && !user.affiliateProfile) {
    secondWelcomeItem = firstWelcomeItem;
    firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.AFFILIATE;
  }

  if (fioWalletsBalances.total?.staked?.nativeFio === 0) {
    secondWelcomeItem = firstWelcomeItem;
    firstWelcomeItem = {
      ...WELCOME_COMPONENT_ITEM_CONTENT.STAKING,
      text:
        WELCOME_COMPONENT_ITEM_CONTENT.STAKING.text + ` Current APY: ${APY}%`,
    };
  }

  if (hasFCH && !hasDomains) {
    secondWelcomeItem = firstWelcomeItem;
    firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.GET_CUSTOM_FIO_DOMAIN;
  }

  if (totalBalance?.nativeFio === 0) {
    secondWelcomeItem = firstWelcomeItem;
    firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.FIO_BALANCE;
  }

  if (!isPinEnabled) {
    secondWelcomeItem = firstWelcomeItem;
    firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.SETUP_PIN;
  }

  if (
    hasFCH &&
    !isEmpty(mappedPublicAddresses) &&
    Object.values(mappedPublicAddresses).every(
      mappedPubicAddress => mappedPubicAddress.publicAddresses.length === 0,
    )
  ) {
    secondWelcomeItem = firstWelcomeItem;
    if (hasOneFCH) {
      firstWelcomeItem = {
        ...WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH_ONE,
        actionButtonLink:
          WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH_ONE.actionButtonLink +
          `?${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${fioAddresses[0]?.name}`,
      };
    } else {
      firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH;
    }
  }

  if (!hasFCH) {
    secondWelcomeItem = firstWelcomeItem;
    firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.NO_FCH;
  }

  if (
    hasDomains &&
    fioDomains.some(fioDomain => isDomainExpired(fioDomain.expiration))
  ) {
    secondWelcomeItem = firstWelcomeItem;
    firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.EXPIRED_DOMAINS;
  }

  if (!hasRecoveryQuestions) {
    secondWelcomeItem = firstWelcomeItem;
    firstWelcomeItem = WELCOME_COMPONENT_ITEM_CONTENT.RECOVERY_PASSWORD;
  }

  let fio101Items = [
    FIO_101_SLIDER_CONTENT.DEFAULT,
    FIO_101_SLIDER_CONTENT.NO_FCH,
    FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
    FIO_101_SLIDER_CONTENT.NO_DOMAINS,
  ];

  if (!hasFCH) {
    fio101Items = [
      FIO_101_SLIDER_CONTENT.NO_FCH,
      FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
      FIO_101_SLIDER_CONTENT.NO_DOMAINS,
      FIO_101_SLIDER_CONTENT.DEFAULT,
    ];
  }

  if (
    hasFCH &&
    !isEmpty(mappedPublicAddresses) &&
    Object.values(mappedPublicAddresses).every(
      mappedPubicAddress => mappedPubicAddress.publicAddresses.length === 0,
    )
  ) {
    if (hasOneFCH) {
      fio101Items = [
        {
          ...FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
          link:
            FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES.oneItemLink +
            `?${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${fioAddresses[0]?.name}`,
        },
        FIO_101_SLIDER_CONTENT.NO_FCH,
        FIO_101_SLIDER_CONTENT.NO_DOMAINS,
        FIO_101_SLIDER_CONTENT.DEFAULT,
      ];
    } else {
      fio101Items = [
        FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
        FIO_101_SLIDER_CONTENT.NO_FCH,
        FIO_101_SLIDER_CONTENT.NO_DOMAINS,
        FIO_101_SLIDER_CONTENT.DEFAULT,
      ];
    }
  }

  if (hasFCH && !hasDomains) {
    fio101Items = [
      FIO_101_SLIDER_CONTENT.NO_DOMAINS,
      FIO_101_SLIDER_CONTENT.NO_FCH,
      FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
      FIO_101_SLIDER_CONTENT.DEFAULT,
    ];
  }

  return {
    isDesktop,
    fio101Items,
    firstWelcomeItem,
    secondWelcomeItem,
    totalBalance,
    totalBalanceLoading: fioLoading,
  };
};
