import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import {
  setCartItems,
  clearCart,
  addToOldCart,
  clearOldCartItems,
} from '../../redux/cart/actions';
import { fioActionExecuted } from '../../redux/fio/actions';
import { onPurchaseResultsClose } from '../../redux/registrations/actions';

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
  cartId as cartIdSelector,
  cartItems,
  oldCart as oldCartSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
} from '../../redux/cart/selectors';
import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';

import useQuery from '../../hooks/useQuery';
import { useEffectOnce } from '../../hooks/general';

import { cartItemsToOrderItems, totalCost } from '../../util/cart';
import { getGAClientId, getGASessionId } from '../../util/analytics';
import { convertFioPrices } from '../../util/prices';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ROUTES } from '../../constants/routes';
import {
  CONTAINED_FLOW_CONTINUE_TEXT,
  CONTAINED_FLOW_ACTIONS,
} from '../../constants/containedFlow';
import { PURCHASE_RESULTS_STATUS } from '../../constants/purchase';
import {
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
  const cartId = useSelector(cartIdSelector);
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

  let buttonText = 'Close';

  useEffectOnce(() => {
    if (!oldCart[orderNumber]) {
      dispatch(addToOldCart(orderNumber, cart));
    }
    dispatch(clearCart({ id: cartId }));
  }, [dispatch, oldCart, orderNumber]);

  useEffect(() => {
    if (noProfile) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [noProfile, history]);

  useEffect(() => {
    return () => dispatch(clearOldCartItems());
  }, [dispatch]);

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
      let updatedCart: CartItem[] = [...oldCart[orderNumber]];
      if (
        status === PURCHASE_RESULTS_STATUS.SUCCESS ||
        status === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS
      ) {
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
          data: {
            gaClientId: getGAClientId(),
            gaSessionId: getGASessionId(),
          },
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
