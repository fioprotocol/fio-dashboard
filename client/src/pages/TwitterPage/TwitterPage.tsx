import React, { useEffect, useState, useCallback, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import Cookies from 'js-cookie';

import AddressWidget from '../../components/AddressWidget';
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
import { log } from '../../util/general';
import { setCookies } from '../../util/cookies';

import { ROUTES } from '../../constants/routes';
import {
  ADDRESS_WIDGET_CONTENT,
  STEPS,
  TWITTER_DOMAIN,
  TWITTER_NOTIFICATIONS,
  TWITTER_SHARE_CONTENT,
  TWITTER_VERIFY_EXPIRATION_TIME,
  TWITTER_VERIFY_TIME,
} from '../../constants/twitter';
import { USERNAME_REGEX } from '../../constants/regExps';
import { DOMAIN_TYPE } from '../../constants/fio';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
} from '../../constants/common';

import {
  CartItem,
  LastAuthData,
  RedirectLinkData,
  TwitterNotification,
} from '../../types';

import classes from './TwitterPage.module.scss';

import neverExpiresIcon from '../../assets/images/landing-page/never-expires-twitter.svg';
import sendReceiveIcon from '../../assets/images/landing-page/send-receive-twitter.svg';

type Props = {
  cartItems: CartItem[];
  isAuthenticated: boolean;
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
    setRedirectPath,
    showLoginModal,
  } = props;

  const convertTwitterToFCH = (value: string) =>
    value
      ? value
          .toLowerCase()
          .replaceAll('@', '')
          .replaceAll('_', '-')
      : value;

  const isValid = (address: string) => {
    return !(
      address.startsWith('_') ||
      address.endsWith('_') ||
      address.startsWith('-') ||
      address.endsWith('-')
    );
  };

  const [notification, setNotification] = useState<TwitterNotification>(
    TWITTER_NOTIFICATIONS.EMPTY,
  );
  const [showTwitterShare, setShowTwitterShare] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [startVerification, setStartVerification] = useState(false);
  const [originalUsername, setOriginalUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(STEPS.ONE);
  const showSubmitButton = !showTwitterShare || isVerified;
  const intervalRef = useRef(null);
  const userfch = `${convertTwitterToFCH(
    originalUsername,
  )}${FIO_ADDRESS_DELIMITER}${TWITTER_DOMAIN}`;

  const [enableRedirect, toggleEnableRedirect] = useState<boolean>(false);

  const count = cartItems.length;

  useEffect(() => {
    if (isVerified) {
      clearInterval(intervalRef.current);
      setShowTwitterShare(false);
      setNotification(TWITTER_NOTIFICATIONS.VERIFIED);
    }
  }, [isVerified]);

  const onUserVerify = useCallback(() => {
    setIsVerified(true);
    clearInterval(intervalRef.current);
    setStartVerification(false);
    setShowTwitterShare(false);
    setNotification(TWITTER_NOTIFICATIONS.VERIFIED);
    setStep(STEPS.THREE);
  }, []);

  const onUserLocked = useCallback(() => {
    setNotification(TWITTER_NOTIFICATIONS.LOCKED);
    clearInterval(intervalRef.current);
    setIsVerified(false);
    setStartVerification(false);
    setShowTwitterShare(false);
  }, []);

  const onUsernameChangedAfterVerify = useCallback(() => {
    clearInterval(intervalRef.current);
    setNotification(TWITTER_NOTIFICATIONS.EMPTY);
    setShowTwitterShare(true);
    setStartVerification(true);
    setIsVerified(false);
  }, []);

  const onNotSupported = useCallback(() => {
    setNotification(TWITTER_NOTIFICATIONS.NOT_SUPPORTED);
    setShowTwitterShare(false);
  }, []);

  const fetchTweetsAndVerify = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apis.twitter.verifyTwitter({
        fch: userfch,
        twh: originalUsername,
      });

      if (data.verified) {
        if (data.token) {
          setCookies(userfch, data.token, {
            expires: data.expires,
          });
        }
        onUserVerify();
      } else if (data.isLocked) {
        onUserLocked();
      } else {
        setIsVerified(false);
      }

      setLoading(false);
    } catch (error) {
      log.error(error);
      setLoading(false);
    }
  }, [userfch, originalUsername, onUserVerify, onUserLocked, setIsVerified]);

  useEffect(() => {
    if (startVerification) {
      intervalRef.current = setInterval(() => {
        fetchTweetsAndVerify();
      }, TWITTER_VERIFY_TIME);

      setTimeout(() => {
        clearInterval(intervalRef.current);
        setStartVerification(false);
        setShowTwitterShare(false);
        setIsVerified(false);
        setNotification(TWITTER_NOTIFICATIONS.TRY_AGAIN);
      }, TWITTER_VERIFY_EXPIRATION_TIME);

      return () => {
        clearInterval(intervalRef.current);
      };
    }
  }, [startVerification, fetchTweetsAndVerify]);

  const onFocusOut = (value: string) => {
    let includesDash = false;
    if (!isValid(value)) {
      onNotSupported();
      return value;
    }

    if (value.includes('_')) {
      includesDash = true;
    }

    const convertedValue = convertTwitterToFCH(value);
    setOriginalUsername(convertedValue.replaceAll('-', '_'));

    const alreadyVerified =
      Cookies.get(
        `${convertedValue}${FIO_ADDRESS_DELIMITER}${TWITTER_DOMAIN}`,
      ) !== undefined;

    if (alreadyVerified) {
      onUserVerify();
      return convertedValue;
    } else if (USERNAME_REGEX.test(convertedValue)) {
      if (includesDash) {
        setNotification(TWITTER_NOTIFICATIONS.CONVERTED);
      } else {
        setNotification(TWITTER_NOTIFICATIONS.EMPTY);
      }
      if (step.stepId === STEPS.THREE.stepId) {
        setStep(STEPS.TWO);
        setShowTwitterShare(true);
      }
    } else {
      setNotification(TWITTER_NOTIFICATIONS.INVALID_FORMAT);
      setShowTwitterShare(false);
    }

    return convertedValue;
  };

  const onInputChanged = (value: string) => {
    if (showTwitterShare || isVerified) {
      setIsVerified(false);
      setStartVerification(false);
      setShowTwitterShare(false);
    }

    if (!value) {
      setStep(STEPS.ONE);
    }

    return value;
  };

  const onTweetShareClicked = () => {
    setStartVerification(true);
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
    if (!isValid(address)) {
      onNotSupported();
    } else {
      setStep(STEPS.TWO);

      const isRegistered = await apis.fio.availCheckTableRows(
        setFioName(address, TWITTER_DOMAIN),
      );

      if (isRegistered) {
        setNotification(TWITTER_NOTIFICATIONS.EXISTING_HANDLE);
      } else if (USERNAME_REGEX.test(address)) {
        setNotification(TWITTER_NOTIFICATIONS.EMPTY);

        const alreadyVerified =
          Cookies.get(`${address}${FIO_ADDRESS_DELIMITER}${TWITTER_DOMAIN}`) !==
          undefined;

        if (alreadyVerified) {
          onUserVerify();
        } else {
          setShowTwitterShare(true);
        }
      }
    }
  };

  const customHandleSubmitVerified = async ({
    address,
  }: {
    address: string;
  }) => {
    if (address === convertTwitterToFCH(originalUsername)) {
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
      toggleEnableRedirect(true);
    } else {
      setOriginalUsername(address.replaceAll('-', '_'));
      onUsernameChangedAfterVerify();
    }
  };

  return (
    <>
      <div className={classes.container}>
        <AddressWidget
          {...ADDRESS_WIDGET_CONTENT}
          suffixText={ADDRESS_WIDGET_CONTENT.suffixText}
          convert={onFocusOut}
          notification={notification}
          customHandleSubmit={
            isVerified
              ? customHandleSubmitVerified
              : customHandleSubmitUnverified
          }
          showSubmitButton={showSubmitButton}
          placeHolderText={ADDRESS_WIDGET_CONTENT.placeHolderText}
          onInputChanged={onInputChanged}
          buttonText={
            step.stepId === 3
              ? ADDRESS_WIDGET_CONTENT.inputButtonTextLastStep
              : ADDRESS_WIDGET_CONTENT.inputButtonText
          }
          formatOnFocusOut
          stepNumber={step.stepNumber}
          stepText={step.stepText}
        />
        {showTwitterShare && (
          <TweetShare
            text={TWITTER_SHARE_CONTENT.text.replace('name@domain', userfch)}
            url={TWITTER_SHARE_CONTENT.url.split('?')[0]}
            hashtags={TWITTER_SHARE_CONTENT.hashtags}
            via={TWITTER_SHARE_CONTENT.via}
            actionText={TWITTER_SHARE_CONTENT.actionText}
            onTweetShareClicked={onTweetShareClicked}
            userfch={userfch}
            stepId={step.stepId}
          />
        )}

        <FCHBanner fch={ADDRESS_WIDGET_CONTENT.fch} />
        <FCHSpecialsBanner
          customNeverExpiresIcon={neverExpiresIcon}
          customNeverExpiresMobileIcon={neverExpiresIcon}
          customSendReceiveIcon={sendReceiveIcon}
        />
        <WidelyAdoptedSection />
        {loading && (
          <div className={classes.loader}>
            <FadeLoader
              height="8px"
              width="5px"
              radius="3px"
              margin="1px"
              color="rgb(118, 92, 214)"
            />
            <p>Verifying account...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TwitterPage;
