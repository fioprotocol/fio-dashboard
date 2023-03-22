import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import {
  setCartItems,
  clear as clearCart,
  addToOldCart,
} from '../../redux/cart/actions';
import { fioActionExecuted } from '../../redux/fio/actions';
import { onPurchaseResultsClose } from '../../redux/registrations/actions';
import { loadProfile } from '../../redux/profile/actions';

import {
  isProcessing as isProcessingSelector,
  roe as roeSelector,
  prices as pricesSelector,
} from '../../redux/registrations/selectors';
import { noProfileLoaded } from '../../redux/profile/selectors';
import {
  containedFlowQueryParams,
  isContainedFlow as isContainedFlowSelector,
} from '../../redux/containedFlow/selectors';
import {
  cartItems,
  oldCart as oldCartSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
} from '../../redux/cart/selectors';
import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';

import useQuery from '../../hooks/useQuery';
import { useEffectOnce } from '../../hooks/general';

import { cartItemsToOrderItems, totalCost } from '../../util/cart';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import { convertFioPrices } from '../../util/prices';
import MathOp from '../../util/math';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ROUTES } from '../../constants/routes';
import {
  CONTAINED_FLOW_CONTINUE_TEXT,
  CONTAINED_FLOW_ACTIONS,
} from '../../constants/containedFlow';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../constants/purchase';
import {
  ANALYTICS_EVENT_ACTIONS,
  ANALYTICS_PAYMENT_TYPE,
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
} from '../../constants/common';
import { ERROR_TYPES } from '../../constants/errors';

import { CartItem, Order, OrderDetailed } from '../../types';
import { CreateOrderActionData } from '../../redux/types';

type ContextProps = {
  orderItem: OrderDetailed;
};

const ALREADY_REGISTERED_ERROR_TEXT = 'already registered';

export const useContext = (
  props: ContextProps,
): {
  actionClick: () => void;
  buttonText: string;
  isProcessing: boolean;
  disabledButton: boolean;
  hideTopCloseButton?: boolean;
} => {
  const history = useHistory<{
    order?: Order;
    orderParams?: CreateOrderActionData;
  }>();
  const noProfile = useSelector(noProfileLoaded);
  const roe = useSelector(roeSelector);
  const containedFlowParams = useSelector(containedFlowQueryParams);
  const isProcessing = useSelector(isProcessingSelector);
  const cart = useSelector(cartItems);
  const oldCart = useSelector(oldCartSelector);
  const prices = useSelector(pricesSelector);
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const userWallets = useSelector(fioWalletsSelector);
  const isContainedFlow = useSelector(isContainedFlowSelector);
  const queryParams = useQuery();
  const orderNumber = queryParams.get(QUERY_PARAMS_NAMES.ORDER_NUMBER);
  const dispatch = useDispatch();

  const { orderItem } = props;
  const { errItems, payment, regItems, status } = orderItem || {};
  const { paymentProcessor } = payment || {};

  let buttonText = 'Close';

  useEffectOnce(() => {
    if (!oldCart[orderNumber]) {
      dispatch(addToOldCart(orderNumber, cart));
    }
    dispatch(clearCart());
  }, [dispatch, oldCart, orderNumber]);

  useEffect(() => {
    if (noProfile) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [noProfile, history]);

  useEffect(() => {
    if (status === PURCHASE_RESULTS_STATUS.SUCCESS) {
      const txIds = regItems.map(regItem => regItem.transaction_id);

      dispatch(
        fioActionExecuted({
          result: { status: 1, txIds },
          executeActionType: CONTAINED_FLOW_ACTIONS.REG,
        }),
      );
    }
  }, [dispatch, status, regItems]);

  useEffectOnce(
    () => {
      if (
        [
          PURCHASE_RESULTS_STATUS.SUCCESS,
          PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS,
        ].includes(status)
      ) {
        const purchasedItems: CartItem[] = [];
        regItems.forEach(regItem => {
          const { id, period = 1 } = regItem;
          const purchasedItem = cart.find(cartItem => cartItem.id === id);
          if (purchasedItem) {
            if (
              purchasedItem.id === id &&
              CART_ITEM_TYPES_WITH_PERIOD.includes(purchasedItem.type) &&
              purchasedItem.period > period
            ) {
              const purchasedItemPeriod = period;
              const fioPrices = convertFioPrices(
                new MathOp(purchasedItem.costNativeFio)
                  .mul(purchasedItemPeriod)
                  .toNumber(),
                roe,
              );
              purchasedItems.push({
                ...purchasedItem,
                period: purchasedItemPeriod,
                costFio: fioPrices.fio,
                costUsdc: fioPrices.usdc,
              });
            } else {
              purchasedItems.push(purchasedItem);
            }
          }
        });
        const purchaseItems = getCartItemsDataForAnalytics(purchasedItems);
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED, {
          ...purchaseItems,
          payment_type: !purchaseItems.value
            ? ANALYTICS_PAYMENT_TYPE.FREE
            : paymentProcessor === PAYMENT_PROVIDER.STRIPE
            ? ANALYTICS_PAYMENT_TYPE.STRIPE
            : ANALYTICS_PAYMENT_TYPE.FIO,
        });
      }
      if (status === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS) {
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED_PARTIAL);
      }
      if (status === PURCHASE_RESULTS_STATUS.FAILED) {
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED_FAILED);
      }
    },
    [status],
    [
      PURCHASE_RESULTS_STATUS.SUCCESS,
      PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS,
      PURCHASE_RESULTS_STATUS.FAILED,
      PURCHASE_RESULTS_STATUS.CANCELED,
    ].includes(status),
  );

  useEffectOnce(
    () => {
      let updatedCart: CartItem[] = [...oldCart[orderNumber]];
      if (
        status === PURCHASE_RESULTS_STATUS.SUCCESS ||
        status === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS
      ) {
        dispatch(loadProfile());

        regItems.forEach(regItem => {
          const { id, period = 1 } = regItem;
          updatedCart = updatedCart
            .filter(
              updatedCartItem =>
                updatedCartItem.id !== id ||
                (CART_ITEM_TYPES_WITH_PERIOD.includes(updatedCartItem.type) &&
                  updatedCartItem.period !== period),
            )
            .map(updatedCartItem => {
              if (
                updatedCartItem.id === id &&
                updatedCartItem.period &&
                updatedCartItem.period > period
              ) {
                updatedCartItem.type = CART_ITEM_TYPE.DOMAIN_RENEWAL;
                updatedCartItem.period -= period;
                const fioPrices = convertFioPrices(
                  updatedCartItem.period * updatedCartItem.costNativeFio,
                  roe,
                );
                updatedCartItem.costFio = fioPrices.fio;
                updatedCartItem.costUsdc = fioPrices.usdc;
              }

              return updatedCartItem;
            });
        });
      }

      if (
        status === PURCHASE_RESULTS_STATUS.FAILED ||
        status === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS
      ) {
        errItems.forEach(errorItem => {
          const { id, error } = errorItem;
          if (error.includes(ALREADY_REGISTERED_ERROR_TEXT)) {
            updatedCart = updatedCart.filter(
              updatedCartItem => updatedCartItem.id !== id,
            );
          }
        });
      }
      dispatch(setCartItems(updatedCart));
    },
    [status],
    [
      PURCHASE_RESULTS_STATUS.SUCCESS,
      PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS,
      PURCHASE_RESULTS_STATUS.FAILED,
    ].includes(status) &&
      (regItems.length > 0 || errItems.length > 0),
  );

  if (
    containedFlowParams != null &&
    containedFlowParams.action &&
    CONTAINED_FLOW_CONTINUE_TEXT[containedFlowParams.action.toUpperCase()]
  ) {
    buttonText =
      CONTAINED_FLOW_CONTINUE_TEXT[containedFlowParams.action.toUpperCase()];
  }

  const onClose = () => {
    dispatch(onPurchaseResultsClose());
  };

  const onRetry = () => {
    const { costUsdc: totalUsdc } = totalCost(cart, roe);
    history.push({
      pathname: ROUTES.CHECKOUT,
      state: {
        orderParams: {
          total: totalUsdc,
          roe,
          publicKey: paymentWalletPublicKey || userWallets[0].publicKey,
          paymentProcessor: payment?.paymentProcessor,
          items: cartItemsToOrderItems(cart, prices, roe),
        },
      },
    });
  };

  let actionClick = onClose;

  const isRetryAvailable =
    !isEmpty(errItems) &&
    errItems.filter(
      ({ errorType, error }) =>
        errorType !== ERROR_TYPES.userHasFreeAddress &&
        !error.includes(ALREADY_REGISTERED_ERROR_TEXT),
    ).length > 0;

  if (isRetryAvailable) {
    actionClick = onRetry;
    buttonText = 'Try Again';
  }

  const finalPurchaseStateStatus = [
    PURCHASE_RESULTS_STATUS.SUCCESS,
    PURCHASE_RESULTS_STATUS.FAILED,
    PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS,
    PURCHASE_RESULTS_STATUS.CANCELED,
  ].includes(status);
  const disabledButton = isContainedFlow && !finalPurchaseStateStatus;

  return {
    actionClick,
    buttonText,
    isProcessing,
    disabledButton,
    hideTopCloseButton: disabledButton,
  };
};
