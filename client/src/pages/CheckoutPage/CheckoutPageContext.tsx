import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { refreshBalance, refreshFioNames } from '../../redux/fio/actions';
import {
  clearCart,
  getCart,
  setWallet as setWalletAction,
} from '../../redux/cart/actions';
import { setProcessing } from '../../redux/registrations/actions';
import { setRedirectPath } from '../../redux/navigation/actions';
import { showGenericErrorModal } from '../../redux/modal/actions';

import {
  fioWallets as fioWalletsSelector,
  fioDomains as fioDomainsSelector,
  loading as fioLoadingSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
} from '../../redux/fio/selectors';
import {
  cartId as cartIdSelector,
  cartItems as cartItemsSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
  loading as cartLoadingSelector,
} from '../../redux/cart/selectors';
import {
  isAuthenticated as isAuthenticatedSelector,
  noProfileLoaded as noProfileLoadedSelector,
  userId as userIdSelector,
} from '../../redux/profile/selectors';
import {
  prices as pricesSelector,
  isProcessing as isProcessingSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import {
  isNoProfileFlow as isNoProfileFlowSelector,
  refProfileCode,
  loading as refProfileLoadingSelector,
} from '../../redux/refProfile/selectors';

import apis from '../../api';

import MathOp from '../../util/math';
import {
  totalCost,
  cartIsRelative,
  groupCartItemsByPaymentWallet,
} from '../../util/cart';
import { getGAClientId, getGASessionId } from '../../util/analytics';
import { setFioName } from '../../utils';
import { useWalletBalances } from '../../util/hooks';
import { useEffectOnce } from '../../hooks/general';
import useQuery from '../../hooks/useQuery';
import { isDomainExpired } from '../../util/fio';
import { log } from '../../util/general';

import { ROUTES } from '../../constants/routes';
import {
  PAYMENT_PROVIDER_PAYMENT_TITLE,
  PAYMENT_OPTIONS,
  PAYMENT_PROVIDER_PAYMENT_OPTION,
  PAYMENT_PROVIDER,
} from '../../constants/purchase';
import {
  CART_ITEM_TYPE,
  NOT_FOUND_CODE,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { STRIPE_REDIRECT_STATUSES } from '../../constants/purchase';
import {
  NOT_FOUND_CART_BUTTON_TEXT,
  NOT_FOUND_CART_MESSAGE,
  NOT_FOUND_CART_TITLE,
} from '../../constants/cart';

import {
  RegistrationResult,
  Payment,
  CartItem,
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
  ApiError,
  PaymentProvider,
  PaymentOptionsProps,
  Order,
  RedirectLinkData,
  AnyObject,
} from '../../types';
import {
  BeforeSubmitData,
  BeforeSubmitState,
  PayWith,
  SignFioAddressItem,
} from './types';
import { CreateOrderActionData } from '../../redux/types';

const SIGN_TX_MAX_FEE_COEFFICIENT = 1.5;

export const useContext = (): {
  cartItems: CartItem[];
  isLoading?: boolean;
  walletBalancesAvailable: WalletBalancesItem;
  paymentWallet: FioWalletDoublet;
  paymentWalletPublicKey: string;
  roe: number | null;
  fioWallets: FioWalletDoublet[];
  fioWalletsBalances: WalletsBalances;
  paymentAssignmentWallets: FioWalletDoublet[];
  payWith: PayWith[];
  isProcessing: boolean;
  isNoProfileFlow: boolean;
  hasPublicCartItems: boolean;
  title: string;
  order: Order;
  payment: Payment;
  paymentOption: PaymentOptionsProps;
  paymentProvider: PaymentProvider | null;
  paymentProviderError: ApiError;
  isFree: boolean;
  beforeSubmitProps: BeforeSubmitState | null;
  fioLoading: boolean;
  orderLoading: boolean;
  refProfileLoading: boolean;
  orderError: ApiError;
  beforePaymentSubmit: (handleSubmit: () => Promise<void>) => Promise<void>;
  onClose: () => void;
  onFinish: (results: RegistrationResult) => Promise<void>;
  setWallet: (walletPublicKey: string) => void;
  setProcessing: (isProcessing: boolean) => void;
} => {
  const cartId = useSelector(cartIdSelector);
  const history = useHistory();
  const fioWallets = useSelector(fioWalletsSelector);
  const fioLoading = useSelector(fioLoadingSelector);
  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const cartItems = useSelector(cartItemsSelector);
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const noProfileLoaded = useSelector(noProfileLoadedSelector);
  const isAuth = useSelector(isAuthenticatedSelector);
  const prices = useSelector(pricesSelector);
  const userDomains = useSelector(fioDomainsSelector);
  const isProcessing = useSelector(isProcessingSelector);
  const roe = useSelector(roeSelector);
  const cartLoading = useSelector(cartLoadingSelector);
  const isNoProfileFlow = useSelector(isNoProfileFlowSelector);
  const refCode = useSelector(refProfileCode);
  const refProfileLoading = useSelector(refProfileLoadingSelector);
  const userId = useSelector(userIdSelector);

  const dispatch = useDispatch();
  const dispatchSetProcessing = (isProcessing: boolean) =>
    dispatch(setProcessing(isProcessing));
  const dispatchSetWallet = useCallback(
    (paymentWalletPublicKey: string) =>
      dispatch(setWalletAction(paymentWalletPublicKey)),
    [dispatch],
  );

  const queryParams = useQuery();
  const stripePaymentIntentParam = queryParams.get(
    QUERY_PARAMS_NAMES.STRIPE_PAYMENT_INTENT,
  );
  const orderNumberParam = queryParams.get(QUERY_PARAMS_NAMES.ORDER_NUMBER);
  const stripeRedirectStatusParam = queryParams.get(
    QUERY_PARAMS_NAMES.STRIPE_REDIRECT_STATUS,
  );
  const publicKeyQueryParams = queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);

  const [
    beforeSubmitProps,
    setBeforeSubmitProps,
  ] = useState<BeforeSubmitState | null>(null);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [orderError, setOrderError] = useState<ApiError>(null);
  const [getOrderLoading, setGetOrderLoading] = useState<boolean>(true);
  const [createOrderLoading, setCreateOrderLoading] = useState<boolean>(true);
  const [cartLoadingStarted, toggleCartLoadingStarted] = useState<boolean>(
    false,
  );

  const location = history.location;

  const { state, search, query } = (location as AnyObject) || {};

  const {
    orderParams: orderParamsFromLocation,
  }: { orderParams?: CreateOrderActionData } = state || {}; // todo: implement setting order params from places where we going to checkout page
  const payment = order && order.payment;
  const paymentProvider = payment ? payment.processor : null;
  const paymentOption = paymentProvider
    ? PAYMENT_PROVIDER_PAYMENT_OPTION[paymentProvider]
    : null;

  const getActiveOrderParams: {
    publicKey?: string;
  } = useMemo(() => ({}), []);

  if (publicKeyQueryParams) {
    getActiveOrderParams.publicKey = publicKeyQueryParams;
  }

  const setWallet = useCallback(
    (paymentWalletPublicKey: string) => {
      dispatchSetWallet(paymentWalletPublicKey);
    },
    [dispatchSetWallet],
  );

  const getOrder = useCallback(async () => {
    let result: Order;

    try {
      result = await apis.orders.getActive(getActiveOrderParams);
    } catch (e) {
      setOrderError(e);
    }

    if (
      result &&
      result.id &&
      cartIsRelative(cartItems, result.orderItems || [])
    ) {
      if (result.publicKey) {
        setWallet(result.publicKey);
      }
      setOrder(result);
      setGetOrderLoading(false);
      setCreateOrderLoading(false);
      return;
    }

    setOrder(null);
    setGetOrderLoading(false);
  }, [cartItems, getActiveOrderParams, setWallet]);

  useEffect(() => {
    if (isNoProfileFlow) {
      return;
    }

    if (!order) {
      return;
    }

    if (order?.publicKey === paymentWalletPublicKey) {
      return;
    }

    apis.orders
      .updatePubKey(paymentWalletPublicKey)
      .then(() => apis.orders.getActive(getActiveOrderParams))
      .then(setOrder);
  }, [
    cartId,
    fioWallets,
    getActiveOrderParams,
    isNoProfileFlow,
    order,
    paymentProvider,
    paymentWalletPublicKey,
  ]);

  const createOrder = useCallback(
    async ({
      paymentWalletPublicKey,
      fioWallets,
      orderParamsFromLocation,
      isFree,
    }: {
      paymentWalletPublicKey: string;
      fioWallets: FioWalletDoublet[];
      orderParamsFromLocation: CreateOrderActionData;
      isFree: boolean;
    }) => {
      let result;
      let orderParams: CreateOrderActionData | null = null;

      if (!orderParamsFromLocation && isFree) {
        orderParams = {
          cartId,
          publicKey: paymentWalletPublicKey,
          paymentProcessor: PAYMENT_PROVIDER.FIO,
          data: {
            gaClientId: getGAClientId(),
            gaSessionId: getGASessionId(),
          },
          refCode,
        };
      }

      if (orderParamsFromLocation) {
        orderParams = { ...orderParamsFromLocation };
        if (!orderParams.publicKey)
          orderParams.publicKey =
            paymentWalletPublicKey || fioWallets[0].publicKey;
      }

      let cartHasExpiredDomain = false;

      const domains = cartItems
        .filter(cartItem => {
          const { domain, type } = cartItem;
          return (
            domain &&
            ![
              CART_ITEM_TYPE.DOMAIN,
              CART_ITEM_TYPE.DOMAIN_RENEWAL,
              CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN,
            ].includes(type)
          );
        })
        .map(cartItem => cartItem.domain);

      const uniqueDomains = [...new Set(domains)];

      for (const domain of uniqueDomains) {
        const { expiration } = (await apis.fio.getFioDomain(domain)) || {};

        if (!expiration) {
          cartHasExpiredDomain = true;
        }

        const isExpired = expiration && isDomainExpired(domain, expiration);

        if (isExpired) {
          cartHasExpiredDomain = true;
          break;
        }
      }

      // There is no order, redirect to cart
      if (!orderParams || cartHasExpiredDomain) {
        return history.push(ROUTES.CART);
      }

      try {
        result = await apis.orders.create(orderParams);
      } catch (e) {
        log.error(e);
        setOrderError(e);

        if (e?.fields?.cart === NOT_FOUND_CODE) {
          dispatch(
            showGenericErrorModal(
              NOT_FOUND_CART_MESSAGE,
              NOT_FOUND_CART_TITLE,
              NOT_FOUND_CART_BUTTON_TEXT,
            ),
          );
          dispatch(clearCart());
        } else {
          dispatch(showGenericErrorModal());
        }
      }

      if (result && result.id) {
        if (result.publicKey) setWallet(result.publicKey);
        setOrderError(null);
        setOrder(result);
        setCreateOrderLoading(false);
        return;
      }

      setOrder(null);
      setCreateOrderLoading(false);
    },
    [
      cartId,
      cartItems,
      dispatch,
      history,
      prices?.nativeFio,
      refCode,
      roe,
      setWallet,
    ],
  );

  const cancelOrder = useCallback(
    (event?: Event) => {
      // BitPay iframe code changes window.location.href and reloads the page. We don't need to cancel order on close BitPay payment page
      if (!event && order?.id) {
        void apis.orders.cancel();
      }
    },
    [order?.id],
  );

  useEffectOnce(
    () => {
      if (!isEmpty(fioWallets)) {
        for (const fioWallet of fioWallets) {
          if (fioWallet.publicKey) {
            dispatch(refreshBalance(fioWallet.publicKey));
            dispatch(refreshFioNames(fioWallet.publicKey));
          }
        }
      }
      void getOrder();
    },
    [dispatch, fioWallets, getOrder, paymentWalletPublicKey],
    (fioWallets.length > 0 &&
      !!userId &&
      (!orderNumberParam ||
        (orderNumberParam && !cartLoading && cartLoadingStarted))) ||
      isNoProfileFlow,
  );

  const isFree =
    !isEmpty(cartItems) && cartItems.every(cartItem => cartItem.isFree);

  const paymentWallet = fioWallets.find(
    ({ publicKey }) => publicKey === paymentWalletPublicKey,
  );
  const { available: walletBalancesAvailable } = useWalletBalances(
    paymentWalletPublicKey,
  );

  const title =
    isFree || !paymentProvider
      ? 'Make Purchase'
      : PAYMENT_PROVIDER_PAYMENT_TITLE[paymentProvider];

  const {
    groups: groupedCartItemsByPaymentWallet,
    hasPublicCartItems,
  } = groupCartItemsByPaymentWallet(
    paymentWallet?.publicKey,
    cartItems,
    fioWallets,
    userDomains,
  );

  const publicCartItemsPaymentWallet = hasPublicCartItems
    ? groupedCartItemsByPaymentWallet.find(
        it => it.signInFioWallet.publicKey === paymentWallet.publicKey,
      )
    : undefined;

  const { costNativeFio: publicCartItemsCost } = totalCost(
    publicCartItemsPaymentWallet?.cartItems ?? [],
    roe,
  );

  const paymentWallets = useMemo(
    () =>
      fioWallets
        .filter(wallet => {
          if (isFree || paymentOption !== PAYMENT_OPTIONS.FIO) return true;

          return wallet.available > publicCartItemsCost;
        })
        .sort(
          (a, b) => b.available - a.available || a.name.localeCompare(b.name),
        ),
    [fioWallets, isFree, paymentOption, publicCartItemsCost],
  );

  useEffect(() => {
    if (
      paymentWallets &&
      paymentWallets.length > 0 &&
      (!paymentWalletPublicKey ||
        !paymentWallets
          .map(it => it.publicKey)
          .includes(paymentWalletPublicKey))
    ) {
      const [defaultWallet] = paymentWallets;
      setWallet(defaultWallet.publicKey);
    }
  }, [paymentWalletPublicKey, paymentWallets, fioWallets, setWallet]);

  // Create order for free address or on retry
  useEffectOnce(
    () => {
      setOrder(undefined);
      void createOrder({
        paymentWalletPublicKey,
        fioWallets,
        orderParamsFromLocation,
        isFree,
      });
    },
    [
      paymentWalletPublicKey,
      fioWallets,
      orderParamsFromLocation,
      cartItems,
      isFree,
    ],
    isAuth &&
      order === null &&
      !orderNumberParam &&
      !getOrderLoading &&
      !fioLoading &&
      !!paymentWalletPublicKey &&
      !!fioWallets.length,
  );

  useEffectOnce(
    () => {
      if (
        stripePaymentIntentParam &&
        orderNumberParam &&
        stripeRedirectStatusParam &&
        isAuth
      ) {
        if (stripeRedirectStatusParam === STRIPE_REDIRECT_STATUSES.SUCCEEDED) {
          const redirectParams = {
            pathname: ROUTES.PURCHASE,
            search: `?${QUERY_PARAMS_NAMES.ORDER_NUMBER}=${orderNumberParam}`,
            query: {
              [QUERY_PARAMS_NAMES.ORDER_NUMBER]: orderNumberParam,
            },
          };

          dispatch(setRedirectPath(redirectParams));

          history.push({
            pathname: ROUTES.PURCHASE,
            search: `${QUERY_PARAMS_NAMES.ORDER_NUMBER}=${orderNumberParam}`,
          });
        }
        if (stripeRedirectStatusParam === STRIPE_REDIRECT_STATUSES.FAILED) {
          dispatch(getCart());
        }
      }
    },
    [
      history,
      isAuth,
      orderNumberParam,
      stripePaymentIntentParam,
      stripeRedirectStatusParam,
      dispatch,
    ],
    !!stripePaymentIntentParam &&
      !!stripeRedirectStatusParam &&
      !!orderNumberParam,
  );

  useEffect(() => {
    window.addEventListener('beforeunload', cancelOrder);

    return () => {
      window.removeEventListener('beforeunload', cancelOrder);
    };
  }, [cancelOrder]);

  useEffect(() => {
    return () => {
      if (history?.location?.pathname !== ROUTES.PURCHASE) {
        cancelOrder();
      }
    };
  }, [cancelOrder, history?.location?.pathname]);

  useEffect(() => {
    if (
      (noProfileLoaded && !isNoProfileFlow) ||
      (isAuth &&
        !cartItems.length &&
        (!orderNumberParam ||
          (orderNumberParam &&
            stripeRedirectStatusParam === STRIPE_REDIRECT_STATUSES.FAILED &&
            !cartLoading &&
            cartLoadingStarted)))
    ) {
      if (stripeRedirectStatusParam) {
        const redirectParams: RedirectLinkData = {
          pathname: ROUTES.CHECKOUT,
          search,
          query,
        };

        dispatch(setRedirectPath(redirectParams));
      }

      if (!cartItems.length && cartId) {
        dispatch(
          showGenericErrorModal(
            NOT_FOUND_CART_MESSAGE,
            NOT_FOUND_CART_TITLE,
            NOT_FOUND_CART_BUTTON_TEXT,
          ),
        );
        dispatch(clearCart());
      }

      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [
    cartId,
    cartItems.length,
    cartLoading,
    cartLoadingStarted,
    isAuth,
    noProfileLoaded,
    history,
    orderNumberParam,
    search,
    stripeRedirectStatusParam,
    dispatch,
    query,
    isNoProfileFlow,
  ]);

  useEffect(() => {
    return () => {
      setOrder(null);
    };
  }, []);

  useEffectOnce(
    () => {
      toggleCartLoadingStarted(cartLoading);
    },
    [cartLoading],
    cartLoading,
  );

  const payWith: PayWith[] = paymentWalletPublicKey
    ? groupedCartItemsByPaymentWallet
        .filter(
          it => !!fioWalletsBalances.wallets[it.signInFioWallet.publicKey],
        )
        .map(it => {
          const totalCostNativeFio = totalCost(it.cartItems, roe).costNativeFio;
          const available =
            fioWalletsBalances.wallets[it.signInFioWallet.publicKey].available;
          const notEnoughFio = available.nativeFio < totalCostNativeFio;

          return {
            ...it,
            available,
            notEnoughFio,
            totalCostNativeFio,
          };
        })
    : [];

  const onClose = useCallback(() => {
    if (order?.id) {
      void apis.orders.cancel();
    }
    history.push(ROUTES.CART);
  }, [order, history]);

  const onFinish = async (results: RegistrationResult) => {
    await apis.orders.processPayment({
      results,
    });

    dispatch(setProcessing(false));
    history.push(
      {
        pathname: ROUTES.PURCHASE,
        search: `${QUERY_PARAMS_NAMES.ORDER_NUMBER}=${order.number}`,
      },
      {
        orderId: order.id,
      },
    );
  };

  const beforePaymentSubmit = async (
    handleSubmit: (data?: BeforeSubmitData) => Promise<void>,
  ) => {
    const privateDomainList: { [domain: string]: boolean } = {};

    for (const cartItem of cartItems) {
      if (
        userDomains.findIndex(({ name }) => name === cartItem.domain) === -1 &&
        cartItem.domainType !== DOMAIN_TYPE.CUSTOM
      ) {
        continue;
      }

      privateDomainList[cartItem.domain] = false;
    }

    for (const domain of Object.keys(privateDomainList)) {
      const params = apis.fio.setTableRowsParams(domain);

      try {
        const { rows } = await apis.fio.getTableRows(params);

        if ((rows && rows.length && rows[0].is_public === 0) || !rows[0]) {
          privateDomainList[domain] = true;
        }
      } catch (e) {
        //
      }
    }

    const signTxItems: SignFioAddressItem[] = [];

    for (const cartItem of cartItems) {
      const includeCartItemTypes = [CART_ITEM_TYPE.ADDRESS];

      const domainWallet = userDomains.find(
        ({ name }) => name === cartItem.domain,
      );

      const paymentFioWallet = fioWallets.find(
        ({ publicKey }) =>
          publicKey ===
          (domainWallet
            ? domainWallet.walletPublicKey
            : paymentWalletPublicKey),
      );

      if (paymentFioWallet?.from === WALLET_CREATED_FROM.LEDGER) {
        includeCartItemTypes.push(CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN);
      }

      if (
        includeCartItemTypes.includes(cartItem.type) &&
        privateDomainList[cartItem.domain]
      ) {
        signTxItems.push({
          fioWallet: paymentFioWallet,
          name: setFioName(cartItem.address, cartItem.domain),
          ownerKey: paymentWalletPublicKey,
          cartItem,
        });
      }
    }

    if (signTxItems.length) {
      return setBeforeSubmitProps({
        fioWallet: paymentWallet,
        fee: new MathOp(prices?.nativeFio?.address)
          .mul(SIGN_TX_MAX_FEE_COEFFICIENT) // +50%
          .round(0, 2)
          .toNumber(),
        submitData: { fioAddressItems: signTxItems },
        onSuccess: (data: BeforeSubmitData) => {
          handleSubmit(data);
          dispatchSetProcessing(false);
        },
        onCancel: () => setBeforeSubmitProps(null),
      });
    }

    return handleSubmit();
  };

  return {
    cartItems,
    isLoading:
      fioLoading ||
      getOrderLoading ||
      createOrderLoading ||
      !paymentProvider ||
      !paymentWalletPublicKey ||
      refProfileLoading,
    walletBalancesAvailable,
    paymentWallet,
    paymentWalletPublicKey,
    roe,
    fioWallets,
    fioWalletsBalances,
    paymentAssignmentWallets: paymentWallets,
    payWith,
    isProcessing,
    isNoProfileFlow,
    hasPublicCartItems,
    title,
    order,
    payment,
    paymentOption,
    paymentProvider,
    paymentProviderError: null,
    isFree,
    beforeSubmitProps,
    fioLoading,
    orderLoading: getOrderLoading || createOrderLoading,
    refProfileLoading,
    orderError,
    beforePaymentSubmit,
    onClose,
    onFinish,
    setWallet,
    setProcessing: dispatchSetProcessing,
  };
};
