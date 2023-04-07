import React, { useEffect, useState, useCallback, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';

import AddressWidget from '../../components/AddressWidget';
import TwitterMeta from '../../components/TwitterMeta/TwitterMeta';
import TweetShare from '../../components/TweetShare/TweetShare';
import { FCHBanner } from '../../components/FCHBanner';
import { FCHSpecialsBanner } from '../../components/SpecialsBanner';
import { WidelyAdoptedSection } from '../../components/WidelyAdoptedSection';

import apis from '../../api';
import { FIO_ADDRESS_DELIMITER, setFioName } from '../../utils';
import { addCartItem } from '../../util/cart';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import { ROUTES } from '../../constants/routes';
import {
  ADDRESS_WIDGET_CONTENT,
  TWITTER_DOMAIN,
  TWITTER_NOTIFICATIONS,
  TWITTER_SHARE_CONTENT,
} from '../../constants/twitter';
import { USERNAME_REGEX } from '../../constants/regExps';
import { DOMAIN_TYPE } from '../../constants/fio';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
} from '../../constants/common';

import {
  AnyType,
  CartItem,
  LastAuthData,
  RedirectLinkData,
  RefProfile,
  TwitterNotification,
} from '../../types';

import classnames from './TwitterPage.module.scss';

import neverExpiresIcon from '../../assets/images/landing-page/never-expires-twitter.svg';
import sendReceiveIcon from '../../assets/images/landing-page/send-receive-twitter.svg';

type Props = {
  cartItems: CartItem[];
  isAuthenticated: boolean;
  refProfileInfo: RefProfile;
  lastAuthData: LastAuthData;
  setRedirectPath: (redirectPath: RedirectLinkData) => void;
  showLoginModal: (redirectRoute: string) => void;
};

const TwitterPage: React.FC<Props & RouteComponentProps> = props => {
  const history = useHistory();
  const {
    cartItems,
    isAuthenticated,
    lastAuthData,
    refProfileInfo,
    setRedirectPath,
    showLoginModal,
  } = props;

  const [notification, setNotification] = useState<TwitterNotification>(
    TWITTER_NOTIFICATIONS.EMPTY,
  );
  const [showTwitterShare, setShowTwitterShare] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [startVerification, setStartVerification] = useState(false);
  const [originalUsername, setOriginalUsername] = useState('');
  const showSubmitButton = !showTwitterShare || isVerified;
  const intervalRef = useRef(null);
  const userfch = `${originalUsername.replaceAll(
    '_',
    '-',
  )}${FIO_ADDRESS_DELIMITER}${TWITTER_DOMAIN}`;

  const [enableRedirect, toggleEnabeRedirect] = useState<boolean>(false);

  const count = cartItems.length;

  useEffect(() => {
    if (isVerified) {
      clearInterval(intervalRef.current);
      setShowTwitterShare(false);
      setNotification(TWITTER_NOTIFICATIONS.VERIFIED);
    }
  }, [isVerified]);

  const fetchTweetsAndVerify = async () => {
    try {
      const response = await fetch(
        `https://twitter154.p.rapidapi.com/user/tweets?username=${originalUsername}&limit=5&include_replies=false`,
        {
          headers: {
            'X-RapidAPI-Host': 'twitter154.p.rapidapi.com',
            'X-RapidAPI-Key':
              '26535d9e38msh4ee3aaea04babd8p1a5ca6jsn5682d49a78b1',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setIsVerified(
        data.results.some((tweet: AnyType) => {
          return tweet.text.includes(userfch);
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (startVerification) {
      intervalRef.current = setInterval(() => {
        fetchTweetsAndVerify();
      }, 5000);

      setTimeout(() => {
        clearInterval(intervalRef.current);
        setStartVerification(false);
      }, 180000);

      return () => {
        clearInterval(intervalRef.current);
      };
    }
  }, [startVerification, fetchTweetsAndVerify]);

  const onFocusOut = (value: string) => {
    const convertedValue = value
      .toLowerCase()
      .replaceAll('@', '')
      .replaceAll('_', '-');

    if (USERNAME_REGEX.test(convertedValue)) {
      setNotification(TWITTER_NOTIFICATIONS.EMPTY);
    } else {
      setNotification(TWITTER_NOTIFICATIONS.INVALID_FORMAT);
      setShowTwitterShare(false);
    }

    return convertedValue;
  };

  const handleRedirect = useCallback(
    (count: number) => {
      fireAnalyticsEvent(
        ANALYTICS_EVENT_ACTIONS.BEGIN_CHECKOUT,
        getCartItemsDataForAnalytics(cartItems),
      );
      let route = ROUTES.CART;
      if (count === 1 && (isAuthenticated || !lastAuthData)) {
        route = ROUTES.CHECKOUT;
      }
      if (!isAuthenticated) {
        setRedirectPath({ pathname: route });
        return lastAuthData
          ? showLoginModal(route)
          : history.push(ROUTES.CREATE_ACCOUNT);
      }
      history.push(route);
    },
    [
      cartItems,
      history,
      isAuthenticated,
      lastAuthData,
      setRedirectPath,
      showLoginModal,
    ],
  );

  useEffect(() => {
    if (count && enableRedirect) {
      handleRedirect(count);
    }
  }, [count, enableRedirect, handleRedirect]);

  const customHandleSubmitUnverified = async ({
    address,
  }: {
    address: string;
  }) => {
    const isRegistered = await apis.fio.availCheckTableRows(
      setFioName(address, TWITTER_DOMAIN),
    );

    setOriginalUsername(address.replaceAll('-', '_'));

    if (isRegistered) {
      setNotification(TWITTER_NOTIFICATIONS.EXISTING_HANDLE);
    } else if (USERNAME_REGEX.test(address)) {
      setNotification(TWITTER_NOTIFICATIONS.EMPTY);
      setShowTwitterShare(true);
      setStartVerification(true);
    }
  };

  const customHandleSubmitVerified = async ({
    address,
  }: {
    address: string;
  }) => {
    const fch = setFioName(address, TWITTER_DOMAIN);
    const cartItem = {
      id: fch,
      address: address,
      domain: TWITTER_DOMAIN,
      costFio: '0',
      costUsdc: '0',
      costNativeFio: 0,
      domainType: DOMAIN_TYPE.PRIVATE,
      period: 1,
      type: CART_ITEM_TYPE.ADDRESS,
      allowFree: true,
    };
    addCartItem(cartItem);
    setNotification(TWITTER_NOTIFICATIONS.EMPTY);
    toggleEnabeRedirect(true);
  };

  return (
    <>
      <TwitterMeta />
      <div className={classnames.container}>
        <AddressWidget
          isDarkWhite={!!refProfileInfo}
          {...ADDRESS_WIDGET_CONTENT}
          formAction={ADDRESS_WIDGET_CONTENT.formAction}
          prefixText={ADDRESS_WIDGET_CONTENT.prefixText}
          convert={onFocusOut}
          notification={notification}
          customHandleSubmit={
            isVerified
              ? customHandleSubmitVerified
              : customHandleSubmitUnverified
          }
          showSubmitButton={showSubmitButton}
          formatOnFocusOut
          suffix
        />
        {showTwitterShare && (
          <TweetShare
            text={TWITTER_SHARE_CONTENT.text.replace('name@domain', userfch)}
            url={TWITTER_SHARE_CONTENT.url}
            hashtags={TWITTER_SHARE_CONTENT.hashtags}
            actionText={TWITTER_SHARE_CONTENT.actionText}
          />
        )}

        <FCHBanner fch={ADDRESS_WIDGET_CONTENT.fch} />
        <FCHSpecialsBanner
          customNeverExpiresIcon={neverExpiresIcon}
          customNeverExpiresMobileIcon={neverExpiresIcon}
          customSendReceiveIcon={sendReceiveIcon}
        />
        <WidelyAdoptedSection />
      </div>
    </>
  );
};

export default TwitterPage;
