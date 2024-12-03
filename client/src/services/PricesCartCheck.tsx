import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addManual } from '../redux/notifications/actions';

import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../redux/registrations/selectors';
import { cartItems as cartItemsSelector } from '../redux/cart/selectors';

import { ACTIONS } from '../components/Notifications/Notifications';
import { BADGE_TYPES } from '../components/Badge/Badge';
import {
  NOTIFICATIONS_CONTENT,
  NOTIFICATIONS_CONTENT_TYPE,
} from '../constants/notifications';
import { ROUTES } from '../constants/routes';

const PricesCartCheck = (): null => {
  const roe = useSelector(roeSelector);
  const prices = useSelector(pricesSelector);
  const cartItems = useSelector(cartItemsSelector);
  const initPricesRef = useRef(false);
  const [pricesChanged, setPricesChanged] = useState(false);
  const dispatch = useDispatch();

  const itemsInCart = !!cartItems.length;

  useEffect(() => {
    if (pricesChanged) {
      setPricesChanged(false);

      if (itemsInCart)
        dispatch(
          addManual({
            action: ACTIONS.CART_PRICES_CHANGED,
            type: BADGE_TYPES.WARNING,
            contentTypeUnique: true,
            contentType: NOTIFICATIONS_CONTENT_TYPE.CART_PRICES_CHANGED,
            title: NOTIFICATIONS_CONTENT.CART_PRICES_CHANGED.title,
            message: NOTIFICATIONS_CONTENT.CART_PRICES_CHANGED.message,
            pagesToShow: [
              ROUTES.CART,
              ROUTES.FIO_ADDRESSES_SELECTION,
              ROUTES.FIO_DOMAINS_SELECTION,
              ROUTES.HOME,
              ROUTES.DASHBOARD,
            ],
          }),
        );
    }
  }, [pricesChanged, itemsInCart, dispatch]);

  useEffect(() => {
    const pricesSet =
      prices.nativeFio.address &&
      prices.nativeFio.domain &&
      prices.nativeFio.combo &&
      prices.nativeFio.addBundles &&
      prices.nativeFio.renewDomain;

    if (roe && pricesSet) {
      if (initPricesRef.current) {
        setPricesChanged(true);
      }

      initPricesRef.current = true;
    }
  }, [
    roe,
    prices.nativeFio.address,
    prices.nativeFio.domain,
    prices.nativeFio.combo,
    prices.nativeFio.addBundles,
    prices.nativeFio.renewDomain,
  ]);

  return null;
};

export default PricesCartCheck;
