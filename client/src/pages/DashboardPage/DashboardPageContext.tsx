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
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioDomains as fioDomainsSelector,
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  isFioWalletsBalanceLoading as isFioWalletsBalanceLoadingSelector,
  loading as fioLoadingSelector,
  mappedPublicAddresses as mappedPublicAddressesSelector,
  walletsFioAddressesLoading as walletsFioAddressesLoadingSelector,
} from '../../redux/fio/selectors';

import {
  hasRecoveryQuestions as hasRecoveryQuestionsSelector,
  isPinEnabled as isPinEnabledSelector,
  loading as edgeLoadingSelector,
} from '../../redux/edge/selectors';

import { user as userSelector } from '../../redux/profile/selectors';

import useEffectOnce from '../../hooks/general';
import { useCheckIfDesktop } from '../../screenType';
import { isDomainExpired } from '../../util/fio';
import { log } from '../../util/general';

import {
  APY_URL,
  WELCOME_COMPONENT_ITEM_CONTENT,
  WelcomeItemProps,
} from './components/WelcomeComponentItem/constants';
import {
  FIO_101_SLIDER_CONTENT,
  Fio101SliderContentProps,
} from './components/Fio101Component/constants';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { WalletBalancesItem } from '../../types';

type UseContextProps = {
  fio101Items: Fio101SliderContentProps[];
  firstWelcomeItem: WelcomeItemProps | null;
  isDesktop: boolean;
  isFioWalletsBalanceLoading: boolean;
  loading: boolean;
  secondWelcomeItem: WelcomeItemProps | null;
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
  const edgeLoading = useSelector(edgeLoadingSelector);
  const fioAddressesLoading = useSelector(fioAddressesLoadingSelector);
  const walletsFioAddressesLoading = useSelector(
    walletsFioAddressesLoadingSelector,
  );
  const isFioWalletsBalanceLoading = useSelector(
    isFioWalletsBalanceLoadingSelector,
  );

  const dispatch = useDispatch();

  const [APY, setAPY] = useState<string>(null);
  const [
    firstWelcomeItem,
    setFirstWelcomeItem,
  ] = useState<WelcomeItemProps | null>(null);
  const [
    secondWelcomeItem,
    setSecondWelcomeItem,
  ] = useState<WelcomeItemProps | null>(null);
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
  const hasOneDomain = fioDomains?.length === 1;

  const totalBalance = fioWalletsBalances?.total?.total;

  const noMappedPubAddresses =
    !isEmpty(mappedPublicAddresses) &&
    Object.values(mappedPublicAddresses).every(
      mappedPubicAddress => mappedPubicAddress.publicAddresses.length === 0,
    );

  const firstFromListFioAddressName = fioAddresses[0]?.name;
  const firstFromListFioDomainName = fioDomains[0]?.name;

  const hasNoStakedTokens = fioWalletsBalances.total?.staked?.nativeFio === 0;

  const hasExpiredDomains = fioDomains.some(fioDomain =>
    isDomainExpired(fioDomain.name, fioDomain.expiration),
  );

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
        dispatch(refreshFioNames(publicKey));
      }
    },
    [fioWallets, dispatch],
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
      let firstItem = WELCOME_COMPONENT_ITEM_CONTENT.OPEN_SEA;
      let secondItem = null;
      if (hasDomains) {
        secondItem = firstItem;
        if (hasOneDomain) {
          firstItem = {
            ...WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN,
            actionButtonLink: {
              ...WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN.actionButtonLink,
              search: `${QUERY_PARAMS_NAMES.NAME}=${firstFromListFioDomainName}`,
            },
          };
        } else {
          firstItem = WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN;
        }
      }
      if (hasDomains) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.GET_ANOTHER_FIO_DOMAIN;
      }
      if (hasDomains && !user.affiliateProfile) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.AFFILIATE;
      }
      if (hasNoStakedTokens) {
        secondItem = firstItem;
        firstItem = {
          ...WELCOME_COMPONENT_ITEM_CONTENT.STAKING,
          text: (
            <>
              {WELCOME_COMPONENT_ITEM_CONTENT.STAKING.text}
              <span className="bold-text"> Current APY: {APY}%</span>
            </>
          ),
        };
      }
      if (hasFCH && !hasDomains) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.GET_CUSTOM_FIO_DOMAIN;
      }
      if (totalBalance?.nativeFio === 0) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.FIO_BALANCE;
      }
      if (!isPinEnabled) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.SETUP_PIN;
      }
      if (hasFCH && noMappedPubAddresses) {
        secondItem = firstItem;
        if (hasOneFCH) {
          firstItem = {
            ...WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH_ONE,
            actionButtonLink: {
              ...WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH_ONE.actionButtonLink,
              search: `${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${firstFromListFioAddressName}`,
            },
          };
        } else {
          firstItem = WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH;
        }
      }
      if (!hasFCH) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.NO_FCH;
      }
      if (hasDomains && hasExpiredDomains) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.EXPIRED_DOMAINS;
      }
      if (!hasRecoveryQuestions) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.RECOVERY_PASSWORD;
      }
      setFirstWelcomeItem(firstItem);
      setSecondWelcomeItem(secondItem);
    }
  }, [
    APY,
    firstFromListFioAddressName,
    firstFromListFioDomainName,
    hasDomains,
    hasExpiredDomains,
    hasFCH,
    hasNoStakedTokens,
    hasOneDomain,
    hasOneFCH,
    hasRecoveryQuestions,
    isPinEnabled,
    loading,
    noMappedPubAddresses,
    totalBalance?.nativeFio,
    user.affiliateProfile,
  ]);

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
    firstWelcomeItem,
    isFioWalletsBalanceLoading,
    loading,
    secondWelcomeItem,
    totalBalance,
    totalBalanceLoading: isFioWalletsBalanceLoading,
  };
};
