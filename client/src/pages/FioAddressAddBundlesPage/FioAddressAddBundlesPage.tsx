import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
} from '../../constants/common';
import { ACTIONS } from '../../constants/fio';
import { ROUTES } from '../../constants/routes';
import { FIO_ADDRESS_DELIMITER } from '../../utils';

import {
  fees as feesSelector,
  feesLoading as feeLoadingSelector,
} from '../../redux/fio/selectors';
import {
  cartId as cartIdSelector,
  cartItems as cartItemsSelector,
} from '../../redux/cart/selectors';
import { userId as userIdSelector } from '../../redux/profile/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';

import { addItem as addItemToCart } from '../../redux/cart/actions';
import { getFee } from '../../redux/fio/actions';

import apis from '../../api';

import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import useQuery from '../../hooks/useQuery';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import useEffectOnce from '../../hooks/general';

const FioAddressAddBundlesPage: React.FC = () => {
  const cartId = useSelector(cartIdSelector);
  const cartItems = useSelector(cartItemsSelector);
  const fees = useSelector(feesSelector);
  const feeLoading = useSelector(feeLoadingSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const userId = useSelector(userIdSelector);

  const [feeLoadingFinished, toggleFeeLoadingFinished] = useState<boolean>(
    false,
  );

  const queryParams = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();

  const fch = queryParams.get(QUERY_PARAMS_NAMES.NAME);

  const addBundledTransactions =
    apis.fio.actionEndPoints.addBundledTransactions;

  const addBundlesFeePrice = fees[addBundledTransactions];
  const addBundledFeeLoading = feeLoading[addBundledTransactions];

  useEffectOnce(() => {
    dispatch(getFee(addBundledTransactions));
  }, [dispatch, addBundledTransactions]);

  useEffect(() => {
    if (addBundledFeeLoading === false) {
      toggleFeeLoadingFinished(true);
    }
  }, [addBundledFeeLoading]);

  useEffect(() => {
    if (feeLoading[addBundledTransactions]) return;

    if (feeLoadingFinished && !addBundlesFeePrice) {
      history.replace(ROUTES.FIO_DOMAINS);
      return;
    }

    if (!addBundlesFeePrice) return;

    const [address, domain] = fch.split(FIO_ADDRESS_DELIMITER);

    const newCartItem = {
      address,
      domain,
      type: CART_ITEM_TYPE.ADD_BUNDLES,
      id: `${fch}-${ACTIONS.addBundledTransactions}-${+new Date()}`,
      costNativeFio: addBundlesFeePrice?.nativeFio,
      costFio: addBundlesFeePrice.fio,
      costUsdc: addBundlesFeePrice.usdc,
    };

    dispatch(
      addItemToCart({
        id: cartId,
        item: newCartItem,
        prices: prices?.nativeFio,
        roe,
        userId,
      }),
    );
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
      getCartItemsDataForAnalytics([newCartItem]),
    );
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.BEGIN_CHECKOUT,
      getCartItemsDataForAnalytics([...cartItems, newCartItem]),
    );
    history.replace(ROUTES.CART);
  }, [
    addBundledTransactions,
    addBundlesFeePrice,
    cartId,
    cartItems,
    dispatch,
    fch,
    feeLoading,
    feeLoadingFinished,
    history,
    prices?.nativeFio,
    roe,
    userId,
  ]);

  return (
    <div className="mx-auto my-auto">
      <FioLoader wrap />
    </div>
  );
};

export default FioAddressAddBundlesPage;
