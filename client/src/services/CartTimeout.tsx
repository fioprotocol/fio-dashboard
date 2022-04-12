import React, {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { BADGE_TYPES } from '../components/Badge/Badge';
import { ACTIONS } from '../components/Notifications/Notifications';
import { REF_ACTIONS } from '../constants/common';
import { ROUTES } from '../constants/routes';
import { NOTIFICATIONS_CONTENT } from '../constants/notifications';

import { setCartDate, clear } from '../redux/cart/actions';
import { addManual as createNotification } from '../redux/notifications/actions';
import {
  isRefFlow,
  refProfileQueryParams,
} from '../redux/refProfile/selectors';
import { cartItems, cartDate } from '../redux/cart/selectors';
import {
  isProcessing,
  captchaResolving,
} from '../redux/registrations/selectors';
import { confirmingPin } from '../redux/edge/selectors';

import { compose } from '../utils';
import useEffectOnce from '../hooks/general';

import { CartItem, RefQueryParams } from '../types';

const INTERVAL = 200;
const CART_TIMEOUT = 1000 * 60 * 30; // 30 min
const MIN = 1000 * 60;
const REF_MESSAGES = {
  [REF_ACTIONS.SIGNNFT]:
    'please add your FIO Crypto Handle again, and purchase in order to complete your NFT signing',
};

type Props = {
  cartItems: CartItem[];
  cartDate: number;
  isRegistrationProcessing: boolean;
  captchaResolving: boolean;
  confirmingPin: boolean;
  isRefFlow: boolean;
  refProfileQueryParams: RefQueryParams;
  clear: () => void;
  createNotification: (data: {
    type: string;
    action: string;
    title?: string;
    message?: string;
    pagesToShow: string[];
  }) => void;
  setCartDate: (dateTime: number) => void;
} & RouteComponentProps;

const CartTimeout: React.FC<Props> = props => {
  const {
    cartItems,
    cartDate,
    setCartDate,
    clear,
    createNotification,
    isRegistrationProcessing,
    captchaResolving,
    confirmingPin,
    history,
    isRefFlow,
    refProfileQueryParams,
  } = props;

  const refAction = refProfileQueryParams ? refProfileQueryParams.action : '';
  const cartItemsAmount = cartItems.length;

  const allowClear = useMemo(
    () => !isRegistrationProcessing && !captchaResolving && !confirmingPin,
    [captchaResolving, confirmingPin, isRegistrationProcessing],
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<boolean>(false);

  const clearCartTimeout = useCallback((): void => {
    intervalRef.current && clearInterval(intervalRef.current);
    intervalRef.current = null;
    allowClear && clear();
    setCartDate(null);
  }, [allowClear, clear, setCartDate]);

  const timeIsOut = useCallback((): void => {
    const { location } = history;
    clearCartTimeout();
    if (
      [ROUTES.CART, ROUTES.CHECKOUT, ROUTES.PURCHASE].indexOf(
        location.pathname,
      ) > -1
    ) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
    createNotification({
      action: ACTIONS.CART_TIMEOUT,
      type: BADGE_TYPES.WARNING,
      title: NOTIFICATIONS_CONTENT.CART_TIMEOUT.title,
      message:
        isRefFlow && refAction != null
          ? `${NOTIFICATIONS_CONTENT.CART_TIMEOUT.message}, ${REF_MESSAGES[refAction]}.`
          : `${NOTIFICATIONS_CONTENT.CART_TIMEOUT.message}. Add your items again.`,
      pagesToShow: [
        ROUTES.CART,
        ROUTES.FIO_ADDRESSES_SELECTION,
        ROUTES.FIO_DOMAINS_SELECTION,
        ROUTES.HOME,
      ],
    });
  }, [clearCartTimeout, history, isRefFlow, refAction, createNotification]);

  const createInterval = useCallback(
    (countDownDate: number | null = null): void => {
      const timeCalculation = (
        countDownDate: number,
        timeIsOut: () => void,
      ) => () => {
        const now = new Date().getTime();

        const distance = countDownDate - now;

        const m = `${Math.floor((distance % (MIN * 60)) / MIN)}`;
        const s = `${Math.floor((distance % MIN) / 1000)}`;
        if (parseInt(m) === 0 && parseInt(s) === 0) {
          return timeIsOut();
        }
        if (parseInt(s) < 0) {
          return;
        }
      };

      const now = new Date().getTime();
      if (!countDownDate)
        countDownDate = new Date().setTime(now + CART_TIMEOUT);
      intervalRef.current && clearInterval(intervalRef.current);
      intervalRef.current = setInterval(
        timeCalculation(countDownDate, timeIsOut),
        INTERVAL,
      );
      setCartDate(countDownDate);
    },
    [timeIsOut, setCartDate],
  );

  useEffect(() => {
    if (intervalRef.current && cartItemsAmount > 0) {
      setRefreshInterval(true);
    }
  }, [cartItemsAmount]);

  useEffect(() => {
    if (!intervalRef.current && !cartDate && cartItemsAmount > 0) {
      createInterval();
    }
    if (cartItemsAmount === 0) {
      clearCartTimeout();
    }
  }, [cartDate, cartItemsAmount, clearCartTimeout, createInterval]);

  useEffect(() => {
    if (refreshInterval) {
      setRefreshInterval(false);
      createInterval();
    }
  }, [refreshInterval, createInterval]);

  useEffectOnce(() => {
    if (!intervalRef.current && cartDate) {
      const now = new Date().getTime();
      if (cartDate < now) {
        timeIsOut();
      } else {
        createInterval(cartDate);
      }
    }
  }, [cartDate, createInterval, timeIsOut]);

  useEffect(
    () => () => intervalRef.current && clearInterval(intervalRef.current),
    [],
  );

  return null;
};

const reduxConnect = connect(
  createStructuredSelector({
    cartItems,
    cartDate,
    isRegistrationProcessing: isProcessing,
    captchaResolving,
    confirmingPin,
    isRefFlow,
    refProfileQueryParams,
  }),
  {
    clear,
    setCartDate,
    createNotification,
  },
);

export default withRouter(compose(reduxConnect)(CartTimeout));
