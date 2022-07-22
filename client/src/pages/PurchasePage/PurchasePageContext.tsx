import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { recalculate } from '../../redux/cart/actions';
import {
  onPurchaseResultsClose,
  setRegistration,
  setProcessing,
} from '../../redux/registrations/actions';
import { fioActionExecuted } from '../../redux/fio/actions';

import {
  registrationResult,
  isProcessing as isProcessingSelector,
  roe as roeSelector,
  prices as pricesSelector,
} from '../../redux/registrations/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';
import { containedFlowQueryParams } from '../../redux/containedFlow/selectors';
import { cartItems } from '../../redux/cart/selectors';
import { order as orderSelector } from '../../redux/order/selectors';

import {
  onPurchaseFinish,
  transformPurchaseResults,
  handlePurchaseStatus,
} from '../../util/purchase';
import { totalCost } from '../../utils';
import { useEffectOnce } from '../../hooks/general';
import { useWebsocket } from '../../hooks/websocket';

import { ROUTES } from '../../constants/routes';
import { CONTAINED_FLOW_CONTINUE_TEXT } from '../../constants/containedFlow';
import {
  PURCHASE_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../constants/purchase';
import { CURRENCY_CODES } from '../../constants/common';
import { WS_ENDPOINTS } from '../../constants/websocket';

import {
  FioActionExecuted,
  RegistrationResult,
  PurchaseProvider,
  PurchaseTxStatus,
  CartItem,
} from '../../types';

export const useContext = (): {
  regItems: CartItem[];
  errItems: CartItem[];
  closeText: string;
  onClose: () => void;
  onFinish: () => void;
  purchaseStatus: PurchaseTxStatus;
  purchaseProvider: PurchaseProvider;
  regPaymentAmount: string | number;
  regConvertedPaymentAmount: string | number;
  regCostFree: string;
  errPaymentAmount: string | number;
  errConvertedPaymentAmount: string | number;
  errCostFree: string;
  paymentCurrency: string;
  convertedPaymentCurrency: string;
  providerTxId: string | number;
  allErrored: boolean;
  failedTxsTotalAmount: string | number;
  isProcessing: boolean;
  isRetry: boolean;
} => {
  const history = useHistory();
  const isAuth = useSelector(isAuthenticated);
  const results = useSelector(registrationResult);
  const roe = useSelector(roeSelector);
  const containedFlowParams = useSelector(containedFlowQueryParams);
  const isProcessing = useSelector(isProcessingSelector);
  const cart = useSelector(cartItems);
  const order = useSelector(orderSelector);
  const prices = useSelector(pricesSelector);

  const dispatch = useDispatch();

  const [orderStatusData, setOrderStatusData] = useState<{
    status: PurchaseTxStatus;
    results?: RegistrationResult;
  }>({ status: results.providerTxStatus });

  const onStatusUpdate = (data: {
    orderStatus: PurchaseTxStatus;
    results?: RegistrationResult;
  }) => {
    setOrderStatusData({
      status: data.orderStatus,
      results: data.results,
    });
  };

  useWebsocket({
    endpoint: WS_ENDPOINTS.ORDER_STATUS,
    params: { orderId: order.id },
    onMessage: onStatusUpdate,
  });

  useEffect(() => {
    if (!isAuth) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [isAuth, history]);

  const { regItems, errItems, updatedCart } = transformPurchaseResults({
    results: orderStatusData.results || results,
    prices,
    roe,
    cart,
  });

  const {
    costNativeFio: regCostNativeFio,
    costFree: regFree,
    costFio: regCostFio,
    costUsdc: regCostUsdc,
  } = totalCost(regItems, roe);

  const {
    costNativeFio: errCostNativeFio,
    costFree: errFree,
    costFio: errCostFio,
    costUsdc: errCostUsdc,
  } = totalCost(errItems, roe);

  const {
    purchaseProvider = PURCHASE_PROVIDER.FIO,
    providerTxId,
    paymentAmount,
    paymentCurrency = CURRENCY_CODES.FIO,
    convertedPaymentCurrency = CURRENCY_CODES.USDC,
  } = results;
  let { convertedPaymentAmount } = results;
  if (
    !convertedPaymentAmount &&
    convertedPaymentCurrency === CURRENCY_CODES.FIO
  ) {
    convertedPaymentAmount = regCostFio;
  }

  const allErrored = isEmpty(regItems) && !isEmpty(errItems);
  const isRetry = !isEmpty(errItems);

  const purchaseStatus = handlePurchaseStatus({
    hasRegItems: !isEmpty(regItems),
    hasFailedItems: !isEmpty(errItems),
    providerTxStatus: orderStatusData.status,
  });

  const failedTxsTotalAmount =
    purchaseStatus === PURCHASE_RESULTS_STATUS.FAILED &&
    purchaseProvider === PURCHASE_PROVIDER.STRIPE
      ? errCostUsdc
      : errCostFio;

  useEffectOnce(() => {
    dispatch(recalculate(updatedCart));
  }, [recalculate, updatedCart]);

  const closeText =
    containedFlowParams != null && containedFlowParams.action
      ? CONTAINED_FLOW_CONTINUE_TEXT[containedFlowParams.action]
      : 'Close';

  const onClose = () => {
    dispatch(setRegistration(null));
    dispatch(onPurchaseResultsClose());
  };

  const onFinish = () =>
    onPurchaseFinish({
      results,
      isRetry: true,
      setRegistration: (results: RegistrationResult) =>
        dispatch(setRegistration(results)),
      setProcessing: (isProcessing: boolean) =>
        dispatch(setProcessing(isProcessing)),
      fioActionExecuted: (data: FioActionExecuted) =>
        dispatch(fioActionExecuted(data)),
      history,
    });

  return {
    regItems,
    errItems,
    closeText,
    onClose,
    onFinish,
    purchaseStatus,
    purchaseProvider,
    // todo: handle other currencies too
    regPaymentAmount: paymentAmount || regCostFio,
    regConvertedPaymentAmount: convertedPaymentAmount || regCostUsdc,
    regCostFree: !regCostNativeFio && regFree,
    errPaymentAmount: errCostFio,
    errConvertedPaymentAmount: errCostUsdc,
    errCostFree: !errCostNativeFio && errFree,
    paymentCurrency,
    convertedPaymentCurrency,
    providerTxId,
    allErrored,
    failedTxsTotalAmount,
    isProcessing,
    isRetry,
  };
};
