import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { setCartItems } from '../../redux/cart/actions';
import {
  onPurchaseResultsClose,
  setRegistration,
} from '../../redux/registrations/actions';

import {
  registrationResult,
  isProcessing as isProcessingSelector,
  roe as roeSelector,
  prices as pricesSelector,
} from '../../redux/registrations/selectors';
import { noProfileLoaded } from '../../redux/profile/selectors';
import { containedFlowQueryParams } from '../../redux/containedFlow/selectors';
import {
  cartItems,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
} from '../../redux/cart/selectors';
import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';

import { transformPurchaseResults } from '../../util/purchase';
import { cartItemsToOrderItems, totalCost } from '../../util/cart';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import { useEffectOnce } from '../../hooks/general';
import { useWebsocket } from '../../hooks/websocket';

import MathOp from '../../util/math';

import { ROUTES } from '../../constants/routes';
import { CONTAINED_FLOW_CONTINUE_TEXT } from '../../constants/containedFlow';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../constants/purchase';
import {
  ANALYTICS_EVENT_ACTIONS,
  ANALYTICS_PAYMENT_TYPE,
  CURRENCY_CODES,
} from '../../constants/common';
import { WS_ENDPOINTS } from '../../constants/websocket';

import {
  FioWalletDoublet,
  RegistrationResult,
  PaymentProvider,
  PurchaseTxStatus,
  CartItem,
  Order,
} from '../../types';
import { ErrBadgesProps } from './types';
import { CreateOrderActionData } from '../../redux/types';

const ERROR_CODES = {
  SINGED_TX_XTOKENS_REFUND_SKIP: 'SINGED_TX_XTOKENS_REFUND_SKIP',
};

export const useContext = (): {
  regItems: CartItem[];
  errItems: CartItem[];
  closeText: string;
  onClose: () => void;
  onRetry: () => void;
  paymentWallet: FioWalletDoublet;
  purchaseStatus: PurchaseTxStatus;
  paymentProvider: PaymentProvider;
  regPaymentAmount: string | number;
  regConvertedPaymentAmount: string | number;
  regCostFree: string;
  errPaymentAmount: string | number;
  errConvertedPaymentAmount: string | number;
  errCostFree: string;
  errorBadges: ErrBadgesProps;
  paymentCurrency: string;
  convertedPaymentCurrency: string;
  providerTxId: string | number;
  allErrored: boolean;
  failedTxsTotalAmount: string | number;
  isProcessing: boolean;
} => {
  const history = useHistory<{
    order?: Order;
    orderParams?: CreateOrderActionData;
  }>();
  const noProfile = useSelector(noProfileLoaded);
  const results = useSelector(registrationResult);
  const roe = useSelector(roeSelector);
  const containedFlowParams = useSelector(containedFlowQueryParams);
  const isProcessing = useSelector(isProcessingSelector);
  const cart = useSelector(cartItems);
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

  const {
    location: { state },
  } = history;
  const { order } = state || {};

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
    if (noProfile) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [noProfile, history]);

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
    paymentProvider = PAYMENT_PROVIDER.FIO,
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

  const failedTxsTotalAmount =
    (orderStatusData.status === PURCHASE_RESULTS_STATUS.FAILED ||
      orderStatusData.status === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS) &&
    paymentProvider === PAYMENT_PROVIDER.STRIPE
      ? errCostUsdc
      : errCostFio;

  const errorBadges: ErrBadgesProps = errItems
    ? errItems.reduce((acc, errItem) => {
        const { errorType, errorData } = errItem;
        let badgeKey: string = '';
        let totalCurrency: string;
        let customItemAmount: number = null;

        if (
          errorData &&
          errorData.code === ERROR_CODES.SINGED_TX_XTOKENS_REFUND_SKIP
        ) {
          badgeKey = `${errorData.code}`;
          totalCurrency = CURRENCY_CODES.FIO;
          customItemAmount = errorData.credited
            ? new MathOp(errorData.credited).toNumber()
            : null;
        } else {
          badgeKey = `${errorType}`;
          totalCurrency =
            paymentProvider === PAYMENT_PROVIDER.STRIPE
              ? CURRENCY_CODES.USDC
              : CURRENCY_CODES.FIO;
        }

        if (!acc[badgeKey])
          acc[badgeKey] = {
            errorType: badgeKey,
            items: [],
            total: '',
            totalCurrency: '',
          };

        acc[badgeKey].errorType = badgeKey;
        acc[badgeKey].items.push(
          customItemAmount
            ? { ...errItem, costNativeFio: customItemAmount }
            : errItem,
        );
        const total = totalCost(acc[badgeKey].items, roe);
        acc[badgeKey].total =
          totalCurrency === CURRENCY_CODES.USDC
            ? total.costUsdc
            : total.costFio;
        acc[badgeKey].totalCurrency = totalCurrency;

        return acc;
      }, {} as ErrBadgesProps)
    : {};

  useEffectOnce(
    () => {
      if (
        [
          PURCHASE_RESULTS_STATUS.SUCCESS,
          PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS,
        ].includes(orderStatusData.status)
      ) {
        const purchaseItems = getCartItemsDataForAnalytics(regItems);
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED, {
          ...purchaseItems,
          transaction_id: order?.number,
          payment_type: !purchaseItems.value
            ? ANALYTICS_PAYMENT_TYPE.FREE
            : results.paymentProvider === PAYMENT_PROVIDER.STRIPE
            ? ANALYTICS_PAYMENT_TYPE.STRIPE
            : ANALYTICS_PAYMENT_TYPE.FIO,
        });
      }
      if (
        orderStatusData.status === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS
      ) {
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED_PARTIAL);
      }
      if (orderStatusData.status === PURCHASE_RESULTS_STATUS.FAILED) {
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.PURCHASE_FINISHED_FAILED);
      }
    },
    [orderStatusData, results],
    [
      PURCHASE_RESULTS_STATUS.SUCCESS,
      PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS,
      PURCHASE_RESULTS_STATUS.FAILED,
      PURCHASE_RESULTS_STATUS.CANCELED,
    ].includes(orderStatusData.status),
  );

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
    ].indexOf(orderStatusData.status) > -1 &&
      paymentProvider === PAYMENT_PROVIDER.STRIPE,
  );

  let closeText = 'Close';

  if (
    containedFlowParams != null &&
    containedFlowParams.action &&
    CONTAINED_FLOW_CONTINUE_TEXT[containedFlowParams.action]
  ) {
    closeText = CONTAINED_FLOW_CONTINUE_TEXT[containedFlowParams.action];
  }

  const onClose = () => {
    dispatch(setRegistration(null));
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
          paymentProcessor: paymentProvider,
          items: cartItemsToOrderItems(cart, prices, roe),
        },
      },
    });
  };

  return {
    regItems,
    errItems,
    closeText,
    onClose,
    onRetry,
    paymentWallet,
    purchaseStatus: orderStatusData.status,
    paymentProvider,
    regPaymentAmount,
    regConvertedPaymentAmount,
    regCostFree: !regCostNativeFio && regFree,
    errPaymentAmount,
    errConvertedPaymentAmount,
    errCostFree: !errCostNativeFio && errFree,
    errorBadges,
    paymentCurrency,
    convertedPaymentCurrency,
    providerTxId,
    allErrored,
    failedTxsTotalAmount,
    isProcessing,
  };
};
