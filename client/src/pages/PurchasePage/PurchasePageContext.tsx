import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { setCartItems } from '../../redux/cart/actions';
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
import {
  cartItems,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
} from '../../redux/cart/selectors';
import { order as orderSelector } from '../../redux/order/selectors';

import {
  onPurchaseFinish,
  transformPurchaseResults,
} from '../../util/purchase';
import { totalCost } from '../../utils';
import { useEffectOnce } from '../../hooks/general';
import { useWebsocket } from '../../hooks/websocket';

import apis from '../../api';

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
  FioWalletDoublet,
  RegistrationResult,
  PurchaseProvider,
  PurchaseTxStatus,
  CartItem,
} from '../../types';
import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';

export const useContext = (): {
  regItems: CartItem[];
  errItems: CartItem[];
  closeText: string;
  onClose: () => void;
  onFinish: () => Promise<void>;
  paymentWallet: FioWalletDoublet;
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
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const userWallets = useSelector(fioWalletsSelector);
  const noResults = !results;
  const paymentWallet = userWallets.find(
    ({ publicKey }) => publicKey === paymentWalletPublicKey,
  );

  const dispatch = useDispatch();

  const [orderStatusData, setOrderStatusData] = useState<{
    status: PurchaseTxStatus;
    results?: RegistrationResult;
  }>({ status: results?.providerTxStatus || PURCHASE_RESULTS_STATUS.PENDING });

  const [prevCart, setPrevCart] = useState<CartItem[]>(cart);

  const onStatusUpdate = (data: {
    orderStatus: PurchaseTxStatus;
    results?: RegistrationResult;
  }) => {
    if (data)
      setOrderStatusData({
        status: data.orderStatus,
        results: data.results,
      });
  };

  useWebsocket({
    endpoint: WS_ENDPOINTS.ORDER_STATUS,
    params: { orderId: order?.id },
    onMessage: onStatusUpdate,
  });

  useEffect(() => {
    if (!isAuth) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [isAuth, history]);

  useEffectOnce(() => {
    if (noResults) {
      history.replace(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [noResults, history]);

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
    paymentCurrency = CURRENCY_CODES.FIO,
    convertedPaymentCurrency = CURRENCY_CODES.USDC,
  } = results || {};
  let regPaymentAmount = regCostFio;
  let regConvertedPaymentAmount = regCostUsdc;
  let errPaymentAmount = errCostFio;
  let errConvertedPaymentAmount = errCostUsdc;
  // todo: handle other currencies too
  if (convertedPaymentCurrency === CURRENCY_CODES.FIO) {
    regPaymentAmount = regCostUsdc;
    regConvertedPaymentAmount = regCostFio;
    errPaymentAmount = errCostUsdc;
    errConvertedPaymentAmount = errCostFio;
  }

  const allErrored = isEmpty(regItems) && !isEmpty(errItems);
  const isRetry =
    purchaseProvider === PURCHASE_PROVIDER.FIO && !isEmpty(errItems);

  const failedTxsTotalAmount =
    (orderStatusData.status === PURCHASE_RESULTS_STATUS.FAILED ||
      orderStatusData.status === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS) &&
    purchaseProvider === PURCHASE_PROVIDER.STRIPE
      ? errCostUsdc
      : errCostFio;

  useEffectOnce(() => {
    dispatch(setCartItems(updatedCart));
  }, [setCartItems, updatedCart]);

  useEffectOnce(() => {
    setPrevCart(cart);
  }, [cart]);

  useEffectOnce(
    () => {
      const { updatedCart } = transformPurchaseResults({
        results: orderStatusData.results,
        prices,
        roe,
        cart: prevCart,
      });
      dispatch(setCartItems(updatedCart));
    },
    [orderStatusData, prevCart, roe, prices],
    [
      PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS,
      PURCHASE_RESULTS_STATUS.FAILED,
      PURCHASE_RESULTS_STATUS.CANCELED,
    ].indexOf(orderStatusData.status) > -1,
  );

  const closeText =
    containedFlowParams != null && containedFlowParams.action
      ? CONTAINED_FLOW_CONTINUE_TEXT[containedFlowParams.action]
      : 'Close';

  const onClose = () => {
    dispatch(setRegistration(null));
    dispatch(onPurchaseResultsClose());
  };

  const onFinish = async () => {
    await apis.orders.update(order.id, {
      status: results.providerTxStatus || PURCHASE_RESULTS_STATUS.DONE,
      results,
    });
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
  };

  return {
    regItems,
    errItems,
    closeText,
    onClose,
    onFinish,
    paymentWallet,
    purchaseStatus: orderStatusData.status,
    purchaseProvider,
    regPaymentAmount,
    regConvertedPaymentAmount,
    regCostFree: !regCostNativeFio && regFree,
    errPaymentAmount,
    errConvertedPaymentAmount,
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
