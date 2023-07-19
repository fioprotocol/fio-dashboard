import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import superagent from 'superagent';

import { isNewUser as isNewUserSelector } from '../../../../redux/profile/selectors';
import {
  APY_URL,
  Types,
  WELCOME_COMPONENT_ITEM_CONTENT,
  WelcomeItemProps,
} from '../WelcomeComponentItem/constants';
import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioDomains as fioDomainsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  loading as fioLoadingSelector,
  mappedPublicAddresses as mappedPublicAddressesSelector,
  walletsFioAddressesLoading as walletsFioAddressesLoadingSelector,
} from '../../../../redux/fio/selectors';
import { user as userSelector } from '../../../../redux/profile/selectors';
import {
  hasRecoveryQuestions as hasRecoveryQuestionsSelector,
  isPinEnabled as isPinEnabledSelector,
  loading as edgeLoadingSelector,
} from '../../../../redux/edge/selectors';
import {
  checkRecoveryQuestions,
  setPinEnabled,
} from '../../../../redux/edge/actions';

import useEffectOnce from '../../../../hooks/general';
import { isDomainExpired } from '../../../../util/fio';
import { log } from '../../../../util/general';

const MAIN_CONTENT = {
  USER_IS_BACK: {
    title: 'Welcome!',
    text: 'Here are a few important actions.',
  },
  USER_IS_FIRST_TIME: {
    title: 'Your FIO journey starts here.',
    text:
      'There’s loads that you can do with FIO, here are just a few things to start with.',
  },
};

type UseContextProps = {
  text: string;
  title: string;
  firstWelcomeItem: WelcomeItemProps | null;
  secondWelcomeItem: WelcomeItemProps | null;
  loading: boolean;
};

export const useContext = (type: Types): UseContextProps => {
  const isNewUser = useSelector(isNewUserSelector);

  const dispatch = useDispatch();

  const [
    firstWelcomeItem,
    setFirstWelcomeItem,
  ] = useState<WelcomeItemProps | null>(null);

  const [
    secondWelcomeItem,
    setSecondWelcomeItem,
  ] = useState<WelcomeItemProps | null>(null);

  const [APY, setAPY] = useState<string>(null);

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

  const hasFCH = fioAddresses?.length > 0;
  const hasOneFCH = fioAddresses?.length === 1;
  const hasDomains = fioDomains?.length > 0;
  const hasOneDomain = fioDomains?.length === 1;
  const hasNoStakedTokens = fioWalletsBalances.total?.staked?.nativeFio === 0;
  const hasExpiredDomains = fioDomains.some(fioDomain =>
    isDomainExpired(fioDomain.name, fioDomain.expiration),
  );

  const loading =
    fioLoading ||
    edgeLoading ||
    fioAddressesLoading ||
    walletsFioAddressesLoading;

  const totalBalance = fioWalletsBalances?.total?.total;

  const noMappedPubAddresses =
    !isEmpty(mappedPublicAddresses) &&
    Object.values(mappedPublicAddresses).every(
      mappedPubicAddress => mappedPubicAddress.publicAddresses.length === 0,
    );

  const firstFromListFioAddressName = fioAddresses[0]?.name;
  const firstFromListFioDomainName = fioDomains[0]?.name;

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

  useEffect(() => {
    if (user.username) {
      dispatch(checkRecoveryQuestions(user.username));
      dispatch(setPinEnabled(user.username));
    }
  }, [dispatch, user.username]);

  useEffectOnce(() => {
    getAPY();
  }, []);

  useEffect(() => {
    if (!loading) {
      let firstItem = WELCOME_COMPONENT_ITEM_CONTENT.OPEN_SEA;
      let secondItem = null;
      if (
        hasDomains &&
        WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN.types.some(
          itemType => itemType === type,
        )
      ) {
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
      if (
        hasDomains &&
        WELCOME_COMPONENT_ITEM_CONTENT.GET_ANOTHER_FIO_DOMAIN.types.some(
          itemType => itemType === type,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.GET_ANOTHER_FIO_DOMAIN;
      }
      if (
        hasDomains &&
        !user.affiliateProfile &&
        WELCOME_COMPONENT_ITEM_CONTENT.AFFILIATE.types.some(
          itemType => itemType === type,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.AFFILIATE;
      }
      if (
        hasNoStakedTokens &&
        WELCOME_COMPONENT_ITEM_CONTENT.STAKING.types.some(
          itemType => itemType === type,
        )
      ) {
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
      if (
        hasFCH &&
        !hasDomains &&
        WELCOME_COMPONENT_ITEM_CONTENT.GET_CUSTOM_FIO_DOMAIN.types.some(
          itemType => itemType === type,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.GET_CUSTOM_FIO_DOMAIN;
      }
      if (
        totalBalance?.nativeFio === 0 &&
        WELCOME_COMPONENT_ITEM_CONTENT.FIO_BALANCE.types.some(
          itemType => itemType === type,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.FIO_BALANCE;
      }
      if (
        !isPinEnabled &&
        WELCOME_COMPONENT_ITEM_CONTENT.SETUP_PIN.types.some(
          itemType => itemType === type,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.SETUP_PIN;
      }
      if (
        hasFCH &&
        noMappedPubAddresses &&
        WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH_ONE.types.some(
          itemType => itemType === type,
        )
      ) {
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
      if (
        !hasFCH &&
        WELCOME_COMPONENT_ITEM_CONTENT.NO_FCH.types.some(
          itemType => itemType === type,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.NO_FCH;
      }
      if (
        hasDomains &&
        hasExpiredDomains &&
        WELCOME_COMPONENT_ITEM_CONTENT.EXPIRED_DOMAINS.types.some(
          itemType => itemType === type,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.EXPIRED_DOMAINS;
      }

      if (
        !hasRecoveryQuestions &&
        WELCOME_COMPONENT_ITEM_CONTENT.RECOVERY_PASSWORD.types.some(
          itemType => itemType === type,
        )
      ) {
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

  const content = isNewUser
    ? MAIN_CONTENT.USER_IS_FIRST_TIME
    : MAIN_CONTENT.USER_IS_BACK;
  const { text, title } = content;

  return {
    text,
    title,
    firstWelcomeItem,
    secondWelcomeItem,
    loading,
  };
};
