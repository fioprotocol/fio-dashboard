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

import { defaultMaxFee } from '../../util/prices';
import {
  totalCost,
  cartIsRelative,
  groupCartItemsByPaymentWallet,
  actionFromCartItem,
  cartItemsToOrderItems,
  walletSupportsCombo,
  handleDomainsExpiration,
} from '../../util/cart';
import { getGAClientId, getGASessionId } from '../../util/analytics';
import { setFioName } from '../../utils';
import { useWalletBalances } from '../../util/hooks';
import { useEffectOnce } from '../../hooks/general';
import useQuery from '../../hooks/useQuery';
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
import { CAPTCHA_ERRORS_CODE } from '../../constants/errors';

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
  Roe,
  Prices,
  FioDomainDoublet,
} from '../../types';
import {
  BeforeSubmitData,
  BeforeSubmitState,
  PayWith,
  SignFioAddressItem,
} from './types';
import { CreateOrderActionData } from '../../redux/types';
import MathOp from '../../util/math';

const SIGN_TX_MAX_FEE_COEFFICIENT = '1.5';

const calculateTotalForOtherWallets = ({
  cartItems,
  fioWallets,
  paymentWallet,
  userDomains,
  prices,
  roe,
}: {
  cartItems: CartItem[];
  fioWallets: FioWalletDoublet[];
  paymentWallet: FioWalletDoublet;
  userDomains: FioDomainDoublet[];
  prices: Prices;
  roe: Roe;
}) => {
  const hasNoComboSupportWallet = fioWallets.find(
    wallet => !walletSupportsCombo(wallet),
  );
  if (!hasNoComboSupportWallet) {
    return {
      selectedPaymentWalletSupportsCombo: false,
      altTotal: null,
    };
  }

  const selectedPaymentWalletSupportsCombo = walletSupportsCombo(paymentWallet);

  const {
    groups: groupedCartItemsByPaymentWallet,
  } = groupCartItemsByPaymentWallet(
    paymentWallet?.publicKey,
    selectedPaymentWalletSupportsCombo
      ? cartItemsToOrderItems({
          cartItems: cartItems ?? [],
          prices: prices.nativeFio,
          supportCombo: false,
          roe,
        }).map(({ nativeFio, domain, data }) => ({
          costNativeFio: nativeFio,
          domain,
          type: data.type,
          id: data.cartItemId,
        }))
      : cartItems,
    fioWallets,
    userDomains,
  );

  return {
    selectedPaymentWalletSupportsCombo,
    altTotal: totalCost(
      groupedCartItemsByPaymentWallet.find(
        it => it.signInFioWallet.publicKey === paymentWallet.publicKey,
      )?.displayOrderItems ?? [],
      roe,
    ).costNativeFio,
  };
};

export const useContext = (): {
  displayOrderItems: CartItem[];
  isLoading?: boolean;
  walletBalancesAvailable: WalletBalancesItem;
  paymentWallet: FioWalletDoublet;
  paymentWalletPublicKey: string;
  roe: Roe;
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
  const orderId = order?.id || null;
  const orderPubKey = order?.publicKey || null;

  const { state, search, query } = (location as AnyObject) || {};

  const {
    orderParams: orderParamsFromLocation,
  }: { orderParams?: CreateOrderActionData } = state || {}; // todo: implement setting order params from places where we going to checkout page
  const payment = order && order.payment;
  const paymentProvider = payment ? payment.processor : null;
  const paymentOption = paymentProvider
    ? PAYMENT_PROVIDER_PAYMENT_OPTION[paymentProvider]
    : null;
  const displayOrderItems = useMemo(() => order?.displayOrderItems || [], [
    order,
  ]);

  const setWallet = useCallback(
    (paymentWalletPublicKey: string) => {
      dispatchSetWallet(paymentWalletPublicKey);
    },
    [dispatchSetWallet],
  );

  const getOrder = useCallback(async () => {
    let result: Order;

    try {
      result = await apis.orders.getActive();
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
  }, [cartItems, setWallet]);

  useEffect(() => {
    if (isNoProfileFlow) {
      return;
    }

    if (!orderId) {
      return;
    }

    if (orderPubKey === paymentWalletPublicKey) {
      return;
    }

    apis.orders
      .updatePubKey(paymentWalletPublicKey)
      .then(() => apis.orders.getActive())
      .then(setOrder);
  }, [isNoProfileFlow, orderId, orderPubKey, paymentWalletPublicKey]);

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

      const {
        hasExpiredDomain,
        hasTooLongDomainRenewal,
      } = await handleDomainsExpiration({ cartItems });

      // There is no order, redirect to cart
      if (!orderParams || hasExpiredDomain || hasTooLongDomainRenewal) {
        return history.push(ROUTES.CART);
      }

      try {
        void (await apis.orders.create(orderParams)); //We don't need the result of the create order

        result = await apis.orders.getActive();
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
    [cartItems, cartId, refCode, history, dispatch, setWallet],
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
    !order && !getOrderLoading // get free items from cart when free order is not created yet
      ? !isEmpty(cartItems) && cartItems.every(cartItem => cartItem.isFree)
      : !isEmpty(displayOrderItems) &&
        displayOrderItems.every(displayOrderItem => displayOrderItem.isFree);

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

  // Group cart items by payment wallet,
  // we need to know if there are items that can be paid only by other wallet in the account (fch with private domains)
  const {
    groups: groupedCartItemsByPaymentWallet,
    hasPublicCartItems,
  } = groupCartItemsByPaymentWallet(
    paymentWallet?.publicKey,
    displayOrderItems,
    fioWallets,
    userDomains,
  );

  const publicCartItemsPaymentWallet = hasPublicCartItems
    ? groupedCartItemsByPaymentWallet.find(
        it => it.signInFioWallet.publicKey === paymentWallet.publicKey,
      )
    : undefined;

  const { costNativeFio: publicCartItemsCost } = totalCost(
    publicCartItemsPaymentWallet?.displayOrderItems ?? [],
    roe,
  );
  // We need to calculate the total for other wallets (that support combo or not)
  // to know if we need to show them in the assignment dropdown
  const { altTotal, selectedPaymentWalletSupportsCombo } =
    hasPublicCartItems && paymentOption === PAYMENT_OPTIONS.FIO
      ? calculateTotalForOtherWallets({
          cartItems: cartItems ?? [],
          fioWallets,
          paymentWallet,
          userDomains,
          prices,
          roe,
        })
      : { altTotal: null, selectedPaymentWalletSupportsCombo: false };

  const paymentWallets = useMemo(
    () =>
      fioWallets
        .filter(wallet => {
          if (!wallet.available || !publicCartItemsCost) return false;
          if (isFree || paymentOption !== PAYMENT_OPTIONS.FIO) return true;

          return new MathOp(wallet.available).gt(
            selectedPaymentWalletSupportsCombo ===
              walletSupportsCombo(wallet) || !altTotal
              ? publicCartItemsCost
              : altTotal,
          );
        })
        .sort(
          (a, b) =>
            new MathOp(b.available).sub(a.available).toNumber() ||
            a.name.localeCompare(b.name),
        ),
    [
      fioWallets,
      isFree,
      paymentOption,
      publicCartItemsCost,
      altTotal,
      selectedPaymentWalletSupportsCombo,
    ],
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
    [paymentWalletPublicKey, fioWallets, orderParamsFromLocation, isFree],
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
          const totalCostNativeFio = totalCost(it.displayOrderItems, roe)
            .costNativeFio;
          const available =
            fioWalletsBalances.wallets[it.signInFioWallet.publicKey].available;
          const notEnoughFio = new MathOp(available.nativeFio).lt(
            totalCostNativeFio,
          );

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
  }, [order?.id, history]);

  const onFinish = async (results: RegistrationResult) => {
    try {
      await apis.orders.processPayment({
        orderId: order.id,
        results: results.registered,
        captcha: results.captcha,
      });
    } catch (err) {
      if (err.code === CAPTCHA_ERRORS_CODE.VERIFICATION_FAILED) {
        const message =
          'We could not verify your CAPTCHA response. Please try again.';
        const title = 'CAPTCHA Verification Failed';
        const buttonText = 'Try Again';

        return dispatch(showGenericErrorModal(message, title, buttonText));
      }

      return dispatch(showGenericErrorModal());
    } finally {
      dispatch(setProcessing(false));
    }

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

    for (const displayOrderItem of displayOrderItems) {
      if (
        userDomains.findIndex(
          ({ name }) => name === displayOrderItem.domain,
        ) === -1 &&
        displayOrderItem.domainType !== DOMAIN_TYPE.CUSTOM
      ) {
        continue;
      }

      privateDomainList[displayOrderItem.domain] = false;
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

    for (const displayOrderItem of displayOrderItems) {
      const includeCartItemTypes = [CART_ITEM_TYPE.ADDRESS];

      const domainWallet = userDomains.find(
        ({ name }) => name === displayOrderItem.domain,
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
        includeCartItemTypes.includes(displayOrderItem.type) &&
        privateDomainList[displayOrderItem.domain]
      ) {
        signTxItems.push({
          fioWallet: paymentFioWallet,
          name: setFioName(displayOrderItem.address, displayOrderItem.domain),
          ownerKey: paymentWalletPublicKey,
          displayOrderItem,
        });
      }
    }

    if (signTxItems.length) {
      return setBeforeSubmitProps({
        fioWallet: paymentWallet,
        fee: defaultMaxFee(prices?.nativeFio?.address, {
          multiple: SIGN_TX_MAX_FEE_COEFFICIENT,
        }) as string,
        submitData: { fioAddressItems: signTxItems },
        onSuccess: (data: BeforeSubmitData) => {
          apis.orders
            .preparedTx(
              displayOrderItems.map(
                ({ address, domain, type, domainType }: CartItem) => ({
                  action: actionFromCartItem(
                    type,
                    (paymentWallet?.from === WALLET_CREATED_FROM.EDGE ||
                      paymentWallet?.from === WALLET_CREATED_FROM.METAMASK) &&
                      domainType === DOMAIN_TYPE.CUSTOM,
                  ),
                  fioName: setFioName(address, domain),
                  data: data?.[setFioName(address, domain)],
                }),
              ),
            )
            .then(() => {
              handleSubmit(data);
              dispatchSetProcessing(false);
            })
            .catch(() => {
              setBeforeSubmitProps(null);
              dispatchSetProcessing(false);
            });
        },
        onCancel: () => setBeforeSubmitProps(null),
      });
    }

    return handleSubmit();
  };

  return {
    displayOrderItems,
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
