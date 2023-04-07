import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';

import AddressWidget from '../../components/AddressWidget';
import TwitterMeta from '../../components/TwitterMeta/TwitterMeta';
import { FCHBanner } from '../../components/FCHBanner';
import { FCHSpecialsBanner } from '../../components/SpecialsBanner';
import { WidelyAdoptedSection } from '../../components/WidelyAdoptedSection';
import { BADGE_TYPES } from '../../components/Badge/Badge';

import apis from '../../api';
import { setFioName } from '../../utils';
import { addCartItem } from '../../util/cart';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import { ROUTES } from '../../constants/routes';
import { addressWidgetContent, TWITTER_DOMAIN } from '../../constants/twitter';
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

const defaultNotificationState: TwitterNotification = {
  hasNotification: false,
  type: '',
  message: '',
  title: '',
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
    defaultNotificationState,
  );
  const [enableRedirect, toggleEnabeRedirect] = useState<boolean>(false);

  const count = cartItems.length;

  const onFocusOut = (value: string) => {
    const convertedValue = value
      .toLowerCase()
      .replaceAll('@', '')
      .replaceAll('_', '-');

    if (USERNAME_REGEX.test(convertedValue)) {
      setNotification(defaultNotificationState);
    } else {
      setNotification({
        hasNotification: true,
        type: BADGE_TYPES.ERROR,
        message:
          'The handle format is not valid. Please update the handle and try again.',
        title: 'Invalid Format',
      });
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

  const customHandleSubmit = async ({ address }: { address: string }) => {
    const fch = setFioName(address, TWITTER_DOMAIN);
    const isRegistered = await apis.fio.availCheckTableRows(
      setFioName(address, TWITTER_DOMAIN),
    );

    if (isRegistered) {
      setNotification({
        hasNotification: true,
        type: BADGE_TYPES.ERROR,
        message:
          'This handle is already registered. If you own it map it to your public addresses.',
        title: 'Existing Handle',
      });
    } else {
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
      setNotification(defaultNotificationState);
      toggleEnabeRedirect(true);
    }
  };

  useEffect(() => {
    if (count && enableRedirect) {
      handleRedirect(count);
    }
  }, [count, enableRedirect, handleRedirect]);

  return (
    <>
      <TwitterMeta />
      <div className={classnames.container}>
        <AddressWidget
          isDarkWhite={!!refProfileInfo}
          {...addressWidgetContent}
          formAction={addressWidgetContent.formAction}
          prefixText={addressWidgetContent.prefixText}
          convert={onFocusOut}
          notification={notification}
          customHandleSubmit={customHandleSubmit}
          formatOnFocusOut
          suffix
        />
        <FCHBanner fch={addressWidgetContent.fch} />
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
