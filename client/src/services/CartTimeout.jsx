import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { BADGE_TYPES } from '../components/Badge/Badge';
import { ACTIONS } from '../components/Notifications/Notifications';
import { REF_ACTIONS } from '../constants/common';
import { ROUTES } from '../constants/routes';
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

const INTERVAL = 200;
const CART_TIMEOUT = 1000 * 60 * 30; // 30 min
const MIN = 1000 * 60;
const MESSAGE = 'Your cart was emptied due to inactivity';
const REF_MESSAGES = {
  [REF_ACTIONS.SIGNNFT]:
    'please add your FIO address again, and purchase in order to complete your NFT signing',
};

const CartTimeout = props => {
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
  const [intervalId, setIntervalId] = useState(null);
  const [time, setTime] = useState('');

  const timeCalculation = countDownDate => () => {
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
    setTime(`${m.length === 1 ? `0${m}` : m}:${s.length === 1 ? `0${s}` : s}`);
  };

  const createInterval = countDownDate => {
    const now = new Date().getTime();
    if (!countDownDate) countDownDate = new Date().setTime(now + CART_TIMEOUT);
    const newIntervalId = setInterval(timeCalculation(countDownDate), INTERVAL);
    setIntervalId(newIntervalId);
    setCartDate(countDownDate);
  };

  const timeIsOut = () => {
    const { location } = history;
    setTime('');
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
      title: 'Cart was emptied',
      message:
        isRefFlow && refProfileQueryParams != null
          ? `${MESSAGE}, ${REF_MESSAGES[refProfileQueryParams.action]}.`
          : `${MESSAGE}. Add your items again.`,
      pagesToShow: [
        ROUTES.CART,
        ROUTES.FIO_ADDRESSES_SELECTION,
        ROUTES.FIO_DOMAINS_SELECTION,
        ROUTES.HOME,
      ],
    });
  };

  const clearCartTimeout = () => {
    intervalId && clearInterval(intervalId);
    setIntervalId(null);
    !isRegistrationProcessing && !captchaResolving && !confirmingPin && clear();
    setCartDate(null);
  };

  useEffect(() => {
    if (!intervalId && !cartDate && cartItems.length > 0) {
      createInterval();
      return () => intervalId && clearInterval(intervalId);
    }
    if (cartItems.length === 0) {
      setTime('');
    }
    if (intervalId && cartItems.length > 0) {
      intervalId && clearInterval(intervalId);
      createInterval();
    }
  }, [cartItems]);

  useEffect(() => {
    if (!intervalId && cartDate) {
      const now = new Date().getTime();
      if (cartDate < now) {
        timeIsOut();
      } else {
        createInterval(cartDate);
      }
    }
  }, [cartDate]);

  useEffect(() => {
    if (!time && intervalId) {
      clearCartTimeout();
    }
  }, [time]);

  useEffect(() => () => intervalId && clearInterval(intervalId), []);

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
