import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { clearCart, createCartFromOrder } from '../../redux/cart/actions';
import { fioActionExecuted } from '../../redux/fio/actions';
import { onPurchaseResultsClose } from '../../redux/registrations/actions';

import {
  isProcessing as isProcessingSelector,
  roe as roeSelector,
  prices as pricesSelector,
} from '../../redux/registrations/selectors';
import {
  noProfileLoaded,
  userId as userIdSelector,
} from '../../redux/profile/selectors';
import {
  containedFlowQueryParams,
  isContainedFlow as isContainedFlowSelector,
} from '../../redux/containedFlow/selectors';
import {
  cartId as cartIdSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
} from '../../redux/cart/selectors';
import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';
import {
  refProfileCode as refProfileCodeSelector,
  isNoProfileFlow as isNoProfileFlowSelector,
} from '../../redux/refProfile/selectors';

import { useEffectOnce } from '../../hooks/general';

import { getGAClientId, getGASessionId } from '../../util/analytics';

import { ROUTES } from '../../constants/routes';
import {
  CONTAINED_FLOW_CONTINUE_TEXT,
  CONTAINED_FLOW_ACTIONS,
} from '../../constants/containedFlow';
import { PURCHASE_RESULTS_STATUS } from '../../constants/purchase';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { REF_PROFILE_SLUG_NAME } from '../../constants/ref';
import {
  ALREADY_REGISTERED_ERROR_TEXT,
  ERROR_TYPES,
} from '../../constants/errors';

import { Order, OrderDetailed } from '../../types';
import { CreateOrderActionData } from '../../redux/types';

type ContextProps = {
  orderItem: OrderDetailed;
};

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

  const prices = useSelector(pricesSelector);
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const userWallets = useSelector(fioWalletsSelector);
  const isContainedFlow = useSelector(isContainedFlowSelector);
  const isNoProfileFlow = useSelector(isNoProfileFlowSelector);
  const refProfileCode = useSelector(refProfileCodeSelector);
  const userId = useSelector(userIdSelector);

  const dispatch = useDispatch();

  const { orderItem } = props;
  const { id, errItems, payment, regItems, status, publicKey } =
    orderItem || {};

  let buttonText = 'Close';

  useEffectOnce(() => {
    if (cartId) {
      dispatch(clearCart({ id: cartId }));
    }
  }, [dispatch, cartId]);

  useEffect(() => {
    if (noProfile && !isNoProfileFlow) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [isNoProfileFlow, noProfile, history]);

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
        status === PURCHASE_RESULTS_STATUS.FAILED ||
        status === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS
      ) {
        dispatch(createCartFromOrder({ orderId: id }));
      }
    },
    [status],
    [
      PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS,
      PURCHASE_RESULTS_STATUS.FAILED,
    ].includes(status) && errItems.length > 0,
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
    if (isNoProfileFlow) {
      history.push({
        pathname: `${ROUTES.NO_PROFILE_REGISTER_FIO_HANDLE.replace(
          REF_PROFILE_SLUG_NAME,
          refProfileCode,
        )}`,
        search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKey}`,
      });
    } else {
      dispatch(onPurchaseResultsClose());
    }
  };

  const onRetry = () => {
    history.push({
      pathname: ROUTES.CHECKOUT,
      state: {
        orderParams: {
          cartId,
          roe,
          publicKey: paymentWalletPublicKey || userWallets[0].publicKey,
          paymentProcessor: payment?.paymentProcessor,
          prices: prices?.nativeFio,
          data: {
            gaClientId: getGAClientId(),
            gaSessionId: getGASessionId(),
          },
          userId,
        },
      },
    });
  };

  let actionClick = onClose;

  const isRetryAvailable =
    !isEmpty(errItems) &&
    !isNoProfileFlow &&
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
