import { useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getFee } from '../../redux/fio/actions';
import { addItem as addItemToCart } from '../../redux/cart/actions';

import { fees as feesSelector } from '../../redux/fio/selectors';
import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';

import apis from '../../api';

import { DEFAULT_FEE_PRICES } from '../../util/prices';
import { FIO_ADDRESS_DELIMITER } from '../../utils';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import {
  CART_ITEM_TYPE,
  ANALYTICS_EVENT_ACTIONS,
} from '../../constants/common';
import { ACTIONS } from '../../constants/fio';
import { ROUTES } from '../../constants/routes';

const EMPTY_STATE_CONTENT = {
  title: 'No FIO Crypto Handles',
  message: 'There are no FIO Crypto Handles in all your wallets',
};

const WARNING_CONTENT = {
  LOW_BUNDLES: {
    title: 'Low Bundles',
    message:
      'Low Bundles - Your remaining bundles amount is low, please add more bundles.',
  },
};

type UseContextProps = {
  emptyStateContent: {
    title: string;
    message: string;
  };
  warningContent: {
    title: string;
    message: string;
  };
  handleAddBundles: (name: string) => void;
};

export const useContext = (): UseContextProps => {
  const cartItems = useSelector(cartItemsSelector);
  const fees = useSelector(feesSelector);

  const dispatch = useDispatch();
  const history = useHistory();

  const addBundlesFeePrice =
    fees[apis.fio.actionEndPoints.addBundledTransactions] || DEFAULT_FEE_PRICES;

  const handleAddBundles = useCallback(
    (name: string) => {
      const [address, domain] = name.split(FIO_ADDRESS_DELIMITER);
      const newCartItem = {
        address,
        domain,
        type: CART_ITEM_TYPE.ADD_BUNDLES,
        id: `${name}-${ACTIONS.addBundledTransactions}-${+new Date()}`,
        allowFree: false,
        costNativeFio: addBundlesFeePrice?.nativeFio,
        costFio: addBundlesFeePrice.fio,
        costUsdc: addBundlesFeePrice.usdc,
      };

      addItemToCart(newCartItem);
      fireAnalyticsEvent(
        ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
        getCartItemsDataForAnalytics([newCartItem]),
      );
      fireAnalyticsEvent(
        ANALYTICS_EVENT_ACTIONS.BEGIN_CHECKOUT,
        getCartItemsDataForAnalytics([...cartItems, newCartItem]),
      );
      history.push(ROUTES.CART);
    },
    [
      addBundlesFeePrice.fio,
      addBundlesFeePrice?.nativeFio,
      addBundlesFeePrice.usdc,
      cartItems,
      history,
    ],
  );

  useEffect(() => {
    dispatch(getFee(apis.fio.actionEndPoints.addBundledTransactions));
  }, [dispatch]);

  return {
    emptyStateContent: EMPTY_STATE_CONTENT,
    warningContent: WARNING_CONTENT.LOW_BUNDLES,
    handleAddBundles,
  };
};
