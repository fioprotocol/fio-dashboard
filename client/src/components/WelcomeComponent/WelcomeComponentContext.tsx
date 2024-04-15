import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import superagent from 'superagent';

import { useHistory } from 'react-router';

import { isNewUser as isNewUserSelector } from '../../redux/profile/selectors';
import {
  APY_URL,
  PAGE_TYPES,
  WELCOME_COMPONENT_ITEM_CONTENT,
  WelcomeItemProps,
} from './constants';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { USER_PROFILE_TYPE } from '../../constants/profile';

import {
  hasRecoveryQuestions as hasRecoveryQuestionsSelector,
  isPinEnabled as isPinEnabledSelector,
} from '../../redux/edge/selectors';

import useEffectOnce from '../../hooks/general';
import { log } from '../../util/general';

import { DefaultWelcomeComponentProps } from './types';
import { ROUTES } from '../../constants/routes';

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
  USER_NOT_HAVE_ADDRESS: {
    title: 'Welcome!',
    text: 'We see you don’t have a FIO Handle, so let’s start there!',
  },
};

type UseContextProps = {
  text: string;
  title: string;
  fioAddress: string;
  firstWelcomeItem: WelcomeItemProps | null;
  secondWelcomeItem: WelcomeItemProps | null;
  loading: boolean;
  handleGetFioAddress: () => void;
  handleChangeFioAddress: ChangeEventHandler<HTMLInputElement>;
};

export const useContext = (
  props: DefaultWelcomeComponentProps,
): UseContextProps => {
  const {
    firstFromListFioAddressName,
    firstFromListFioDomainName,
    firstFromListFioWalletPublicKey,
    hasAffiliate,
    hasDomains,
    hasAddresses,
    hasExpiredDomains,
    hasFCH,
    hasNoEmail,
    hasNoStakedTokens,
    hasOneDomain,
    hasOneFCH,
    hasZeroTotalBalance,
    loading,
    noMappedPubAddresses,
    pageType = PAGE_TYPES.ALL,
    userType,
  } = props;

  const history = useHistory();

  const isNewUser = useSelector(isNewUserSelector);

  const [
    firstWelcomeItem,
    setFirstWelcomeItem,
  ] = useState<WelcomeItemProps | null>(null);

  const [
    secondWelcomeItem,
    setSecondWelcomeItem,
  ] = useState<WelcomeItemProps | null>(null);

  const [APY, setAPY] = useState<string>(null);
  const [fioAddress, setFioAddress] = useState<string>(null);

  const hasRecoveryQuestions = useSelector(hasRecoveryQuestionsSelector);
  const isPinEnabled = useSelector(isPinEnabledSelector);

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

  useEffectOnce(() => {
    void getAPY();
  }, []);

  useEffect(() => {
    if (!loading) {
      let firstItem = WELCOME_COMPONENT_ITEM_CONTENT.OPEN_SEA;
      let secondItem = null;
      if (
        hasDomains &&
        WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN.types.some(
          itemType => itemType === pageType,
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
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.GET_ANOTHER_FIO_DOMAIN;
      }
      if (
        hasDomains &&
        !hasAffiliate &&
        WELCOME_COMPONENT_ITEM_CONTENT.AFFILIATE.types.some(
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.AFFILIATE;
      }
      if (
        hasNoStakedTokens &&
        WELCOME_COMPONENT_ITEM_CONTENT.STAKING.types.some(
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;

        firstItem = {
          ...WELCOME_COMPONENT_ITEM_CONTENT.STAKING,
          actionButtonLink: {
            ...WELCOME_COMPONENT_ITEM_CONTENT.STAKING.actionButtonLink,
            search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${firstFromListFioWalletPublicKey}`,
          },
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
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.GET_CUSTOM_FIO_DOMAIN;
      }
      if (
        hasZeroTotalBalance &&
        WELCOME_COMPONENT_ITEM_CONTENT.FIO_BALANCE.types.some(
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.FIO_BALANCE;
      }
      if (
        !isPinEnabled &&
        userType === USER_PROFILE_TYPE.PRIMARY &&
        WELCOME_COMPONENT_ITEM_CONTENT.SETUP_PIN.types.some(
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.SETUP_PIN;
      }
      if (
        hasFCH &&
        noMappedPubAddresses &&
        WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH_ONE.types.some(
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;
        if (hasOneFCH) {
          firstItem = {
            ...WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH_ONE,
            actionButtonLink: {
              ...WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH_ONE.actionButtonLink,
              search: `${QUERY_PARAMS_NAMES.FIO_HANDLE}=${firstFromListFioAddressName}`,
            },
          };
        } else {
          firstItem = WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH;
        }
      }
      if (
        !hasFCH &&
        WELCOME_COMPONENT_ITEM_CONTENT.NO_FCH.types.some(
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.NO_FCH;
      }
      if (
        hasDomains &&
        hasExpiredDomains &&
        WELCOME_COMPONENT_ITEM_CONTENT.EXPIRED_DOMAINS.types.some(
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.EXPIRED_DOMAINS;
      }

      if (
        !hasRecoveryQuestions &&
        userType === USER_PROFILE_TYPE.PRIMARY &&
        WELCOME_COMPONENT_ITEM_CONTENT.RECOVERY_PASSWORD.types.some(
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.RECOVERY_PASSWORD;
      }

      if (
        hasNoEmail &&
        userType === USER_PROFILE_TYPE.ALTERNATIVE &&
        WELCOME_COMPONENT_ITEM_CONTENT.USER_EMAIL.types.some(
          itemType => itemType === pageType,
        )
      ) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.USER_EMAIL;
      }

      setFirstWelcomeItem(firstItem);
      setSecondWelcomeItem(secondItem);
    }
  }, [
    APY,
    firstFromListFioAddressName,
    firstFromListFioDomainName,
    firstFromListFioWalletPublicKey,
    hasAffiliate,
    hasDomains,
    hasExpiredDomains,
    hasFCH,
    hasNoStakedTokens,
    hasOneDomain,
    hasOneFCH,
    hasNoEmail,
    hasRecoveryQuestions,
    hasZeroTotalBalance,
    isPinEnabled,
    loading,
    noMappedPubAddresses,
    pageType,
    userType,
  ]);

  const handleGetFioAddress = useCallback(() => {
    history.push(ROUTES.FIO_ADDRESSES_SELECTION + `?address=${fioAddress}`);
  }, [history, fioAddress]);

  const handleChangeFioAddress = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setFioAddress(evt.target.value);
    },
    [setFioAddress],
  );

  const content = hasAddresses
    ? isNewUser
      ? MAIN_CONTENT.USER_IS_FIRST_TIME
      : MAIN_CONTENT.USER_IS_BACK
    : MAIN_CONTENT.USER_NOT_HAVE_ADDRESS;

  const { text, title } = content;

  return {
    text,
    title,
    fioAddress,
    firstWelcomeItem,
    secondWelcomeItem,
    loading,
    handleGetFioAddress,
    handleChangeFioAddress,
  };
};
