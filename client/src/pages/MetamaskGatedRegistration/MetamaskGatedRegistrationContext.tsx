import React, { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { BADGE_TYPES } from '../../components/Badge/Badge';

import { user as userSelector } from '../../redux/profile/selectors';
import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { refProfileCode } from '../../redux/refProfile/selectors';

import { addItem as addItemToCart } from '../../redux/cart/actions';

import apis from '../../api';
import { FIO_ADDRESS_DELIMITER, setFioName } from '../../utils';
import { validateFioAddress } from '../../util/fio';
import { convertFioPrices } from '../../util/prices';
import { log } from '../../util/general';
import { useContext as useContextMetamaskLogin } from '../../components/LoginForm/components/MetamaskLogin/MetamaskLoginContext';

import { DOMAIN_TYPE, METAMASK_DOMAIN_NAME } from '../../constants/fio';
import {
  CART_ITEM_PERIOD_OPTIONS_IDS,
  CART_ITEM_TYPE,
} from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { USER_PROFILE_TYPE } from '../../constants/profile';
import { METAMASK_UNSUPPORTED_MOBILE_MESSAGE } from '../../constants/errors';

import metamaskAtLogoSrc from '../../assets/images/metamask-landing/metamask-at.svg';

import { AddressWidgetNotification } from '../../types';

import classes from './MetamaskgatedRegistration.module.scss';

const NOTIFICATIONS = {
  EMPTY: {
    hasNotification: false,
    type: '',
    message: '',
    title: '',
  },
  INSTALL_METAMASK: {
    hasNotification: true,
    type: BADGE_TYPES.WARNING,
    message:
      'Please ensure that the MetaMask browser extension is installed and active. Or refresh the page if it has just been installed.',
    title: 'MetaMask not detected.',
  },
  INSTALL_MOBILE_METAMASK: {
    hasNotification: true,
    type: BADGE_TYPES.WARNING,
    message: METAMASK_UNSUPPORTED_MOBILE_MESSAGE,
    title: 'MetaMask app is not supported.',
  },
  NON_VALID_FIO_HANDLE: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message: '',
    title: 'FIO Handle is not valid.',
  },
  FIO_HANDLE_ALREADY_REGISTERED: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message:
      'This handle is already registered. If you own it map it to your public addresses.',
    title: 'FIO Handle Already registered.',
  },
  USER_HAS_FREE_ADDRESS: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message: 'You already have a FIO Handle on @metamask domain.',
    title: 'FIO Handle registration error.',
  },
  USER_HAS_METAMASK_FIO_HANDLE_IN_CART: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message: 'You already have a FIO Handle on @metamask domain in your cart.',
    title: 'FIO Handle registration error.',
  },
  NON_METAMASK_USER: {
    hasNotification: true,
    type: BADGE_TYPES.WARNING,
    message:
      'You logged in as a non-MetaMask user. To add a FIO Handle, you should sign in using a MetaMask account.',
    title: 'Non MetaMask user.',
  },
  GENERAL_ERROR: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message: 'Something went wrong. Please try again.',
    title: 'Error',
  },
};

type UseContext = {
  addressWidgetContent: {
    classNameContainer: string;
    classNameForm: string;
    classNameLogo: string;
    classNameLogoContainer: string;
    disabled: boolean;
    disabledInput: boolean;
    loading: boolean;
    logoSrc: string;
    notification: {
      hasNotification: boolean;
      type: string;
      message: string;
      title: string;
    };
    subtitle: string;
    suffixText: string;
    title: React.ReactNode;
    onInputChanged: (value: string) => string;
    customHandleSubmit: ({
      address,
    }: {
      address: string;
    }) => Promise<void> | void;
  };
  isLoginModalOpen: boolean;
  onLoginModalClose: () => void;
};

const TitleComponent = () => (
  <div className={classes.title}>Get Your Free @metamask Handle</div>
);

export const useContext = (): UseContext => {
  const cartItems = useSelector(cartItemsSelector);
  const user = useSelector(userSelector);
  const prices = useSelector(pricesSelector);
  const refCode = useSelector(refProfileCode);
  const roe = useSelector(roeSelector);

  const [notification, setNotification] = useState<AddressWidgetNotification>(
    NOTIFICATIONS.EMPTY,
  );
  const [fioHandle, setFioHandle] = useState<string | null>(null);
  const [loading, toggleLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const {
    isLoginModalOpen,
    isMobileDeviceWithMetamask,
    connectMetamask,
    onLoginModalClose,
  } = useContextMetamaskLogin();

  const isVerified = !isMobileDeviceWithMetamask;
  const userHasMetamaskFioHandleInCart = cartItems.find(
    cartItem => cartItem.domain === METAMASK_DOMAIN_NAME,
  );

  const onInputChanged = useCallback((value: string) => {
    setNotification(NOTIFICATIONS.EMPTY);

    return value;
  }, []);

  const checkIsFioHandleValid = (fioHandle: string) => {
    if (!fioHandle) return;

    const isNotValidAddressError = validateFioAddress(
      fioHandle,
      METAMASK_DOMAIN_NAME,
    );

    if (isNotValidAddressError) {
      setNotification({
        ...NOTIFICATIONS.NON_VALID_FIO_HANDLE,
        message: isNotValidAddressError,
      });
    }

    return !isNotValidAddressError;
  };

  const checkIfFioHandleRegistered = useCallback(async (fioHandle: string) => {
    const isRegistered = await apis.fio.availCheckTableRows(
      setFioName(fioHandle, METAMASK_DOMAIN_NAME),
    );

    if (isRegistered) {
      setNotification(NOTIFICATIONS.FIO_HANDLE_ALREADY_REGISTERED);
    }

    return isRegistered;
  }, []);

  const customHandleSubmitVerified = useCallback(
    async ({ address }: { address: string }): Promise<void> => {
      try {
        toggleLoading(true);

        const isFioHandleValid = checkIsFioHandleValid(address);

        if (!isFioHandleValid) return;

        const isRegistered = await checkIfFioHandleRegistered(address);

        if (isRegistered) return;

        if (!user) {
          connectMetamask();
        }

        setFioHandle(address);
      } catch (error) {
        log.error(error);
        setNotification(NOTIFICATIONS.GENERAL_ERROR);
      } finally {
        toggleLoading(false);
      }
    },
    [checkIfFioHandleRegistered, connectMetamask, user],
  );

  const customHandleSubmitUnverified = useCallback(() => {
    setNotification(
      isMobileDeviceWithMetamask
        ? NOTIFICATIONS.INSTALL_MOBILE_METAMASK
        : NOTIFICATIONS.INSTALL_METAMASK,
    );
  }, [isMobileDeviceWithMetamask]);

  const handleAddCartItem = useCallback(
    async ({ address }: { address: string }): Promise<void> => {
      try {
        toggleLoading(true);

        const { fio, usdc } = convertFioPrices(prices.nativeFio.address, roe);

        const gatedToken = await apis.users.verifyAlternativeUser();

        const cartItem = {
          id: setFioName(address, METAMASK_DOMAIN_NAME),
          address,
          domain: METAMASK_DOMAIN_NAME,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: prices.nativeFio.address,
          domainType: DOMAIN_TYPE.PRIVATE,
          isFree: true,
          period: parseFloat(CART_ITEM_PERIOD_OPTIONS_IDS.ONE_YEAR),
          type: CART_ITEM_TYPE.ADDRESS,
        };

        dispatch(
          addItemToCart({
            item: cartItem,
            refCode,
            token: gatedToken,
          }),
        );

        history.push(ROUTES.CART);
      } catch (error) {
        log.error(error);
        setNotification(NOTIFICATIONS.GENERAL_ERROR);
      } finally {
        toggleLoading(false);
      }
    },
    [dispatch, history, prices.nativeFio, refCode, roe],
  );

  const getFreeUserMetamaskAddresses = useCallback(async () => {
    try {
      return await apis.users.getFreeAddresses();
    } catch (error) {
      log.error(error);
      setNotification(NOTIFICATIONS.GENERAL_ERROR);
    }
  }, []);

  const handleSubmit = useCallback(
    async ({ fioHandle }: { fioHandle: string }) => {
      try {
        if (userHasMetamaskFioHandleInCart) {
          setNotification(NOTIFICATIONS.USER_HAS_METAMASK_FIO_HANDLE_IN_CART);
          return;
        }

        const freeAddresses = await getFreeUserMetamaskAddresses();

        if (
          freeAddresses.length &&
          freeAddresses.some(
            freeAddressItem =>
              freeAddressItem.name.split(FIO_ADDRESS_DELIMITER)[1] ===
              METAMASK_DOMAIN_NAME,
          )
        ) {
          setNotification(NOTIFICATIONS.USER_HAS_FREE_ADDRESS);
          return;
        }

        handleAddCartItem({ address: fioHandle });
      } catch (error) {
        log.error(error);
        setNotification(NOTIFICATIONS.GENERAL_ERROR);
      }
    },
    [
      userHasMetamaskFioHandleInCart,
      getFreeUserMetamaskAddresses,
      handleAddCartItem,
    ],
  );

  useEffect(() => {
    if (user) {
      if (user.userProfileType === USER_PROFILE_TYPE.ALTERNATIVE) {
        if (fioHandle) {
          handleSubmit({ fioHandle });
        }
      } else {
        setNotification(NOTIFICATIONS.NON_METAMASK_USER);
      }
    }
  }, [fioHandle, user, handleSubmit]);

  const addressWidgetContent = {
    classNameContainer: classes.widgetContainer,
    classNameForm: classes.form,
    classNameLogo: classes.logo,
    classNameLogoContainer: classes.logoContainer,
    disabled: notification.hasNotification || loading,
    disabledInput: loading,
    loading,
    logoSrc: metamaskAtLogoSrc,
    notification,
    subtitle: 'and make your cryptocurrency payments easy',
    suffixText: `@${METAMASK_DOMAIN_NAME}`,
    title: <TitleComponent />,
    onInputChanged,
    customHandleSubmit: isVerified
      ? customHandleSubmitVerified
      : customHandleSubmitUnverified,
  };
  return {
    addressWidgetContent,
    isLoginModalOpen,
    onLoginModalClose,
  };
};
